import logging
import time

import httpx

from google import genai
from google.genai import errors, types

from app.domain.entities import ProviderFailedError, ProviderRateLimitedError, ProviderUnavailableError

log = logging.getLogger(__name__)

# Reintentos ante saturación temporal del modelo (503 "high demand"): esperas
# en segundos antes del segundo y tercer intento.
RETRY_DELAYS = (1.5, 4.0)


class GeminiProvider:
    """Adapter del puerto AIProvider para Google Gemini."""

    name = "gemini"

    def __init__(self, api_key: str | None, model: str):
        self.model = model
        # 30 s por intento: con los reintentos la respuesta llega antes de los
        # 100 s que espera el Gateway para las rutas de IA.
        options = types.HttpOptions(timeout=30_000)
        self.client = genai.Client(api_key=api_key, http_options=options) if api_key else None

    def generate(self, prompt: str, *, system: str, expects_json: bool) -> str:
        if self.client is None:
            raise ProviderUnavailableError("El servicio de IA no tiene configurada su clave de acceso.")
        config = types.GenerateContentConfig(
            system_instruction=system,
            temperature=0.4,
            # El razonamiento interno consume el mismo presupuesto de tokens que
            # la respuesta: con nivel bajo la retroalimentación llega completa.
            max_output_tokens=8192,
            thinking_config=types.ThinkingConfig(thinking_level="low"),
            response_mime_type="application/json" if expects_json else "text/plain",
        )
        try:
            response = self._generate_with_retry(prompt, config)
        except errors.ClientError as error:
            log.warning("gemini rechazó la solicitud: %s", error)
            if error.code == 429:
                raise ProviderRateLimitedError(
                    "La IA recibió muchas solicitudes seguidas. Espera unos segundos e inténtalo de nuevo."
                ) from error
            if error.code in (401, 403):
                raise ProviderUnavailableError("La clave del proveedor de IA no es válida.") from error
            raise ProviderFailedError("La IA no pudo procesar esta solicitud.") from error
        except httpx.TimeoutException as error:
            log.warning("gemini no respondió a tiempo: %s", error)
            raise ProviderFailedError("La IA está tardando más de lo normal. Inténtalo de nuevo en unos segundos.") from error
        except (errors.ServerError, errors.APIError) as error:
            log.warning("gemini falló: %s", error)
            raise ProviderFailedError("La IA está saturada en este momento. Inténtalo de nuevo en unos segundos.") from error

        text = response.text or ""
        candidate = response.candidates[0] if response.candidates else None
        if expects_json and candidate is not None and candidate.finish_reason == types.FinishReason.MAX_TOKENS:
            log.warning("gemini cortó la respuesta JSON por límite de tokens")
            raise ProviderFailedError("La respuesta de la IA quedó incompleta. Inténtalo de nuevo.")
        if not text.strip():
            raise ProviderFailedError("La IA no generó una respuesta para este aporte. Intenta reformularlo.")
        return text

    def _generate_with_retry(self, prompt: str, config: types.GenerateContentConfig):
        for attempt, delay in enumerate((*RETRY_DELAYS, None), start=1):
            try:
                return self.client.models.generate_content(model=self.model, contents=prompt, config=config)
            except (errors.ServerError, httpx.TimeoutException) as error:
                if delay is None:
                    raise
                log.info("gemini falló (%s); reintento %d en %.1f s", getattr(error, "code", "timeout"), attempt, delay)
                time.sleep(delay)
