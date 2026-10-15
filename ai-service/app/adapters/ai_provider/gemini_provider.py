import logging

from google import genai
from google.genai import errors, types

from app.domain.entities import ProviderFailedError, ProviderRateLimitedError, ProviderUnavailableError

log = logging.getLogger(__name__)


class GeminiProvider:
    """Adapter del puerto AIProvider para Google Gemini."""

    name = "gemini"

    def __init__(self, api_key: str | None, model: str):
        self.model = model
        self.client = genai.Client(api_key=api_key) if api_key else None

    def generate(self, prompt: str, *, system: str, expects_json: bool) -> str:
        if self.client is None:
            raise ProviderUnavailableError("El servicio de IA no tiene configurada su clave de acceso.")
        config = types.GenerateContentConfig(
            system_instruction=system,
            temperature=0.4,
            max_output_tokens=2048,
            response_mime_type="application/json" if expects_json else "text/plain",
        )
        try:
            response = self.client.models.generate_content(model=self.model, contents=prompt, config=config)
        except errors.ClientError as error:
            log.warning("gemini rechazó la solicitud: %s", error)
            if error.code == 429:
                raise ProviderRateLimitedError(
                    "La IA recibió muchas solicitudes seguidas. Espera unos segundos e inténtalo de nuevo."
                ) from error
            if error.code in (401, 403):
                raise ProviderUnavailableError("La clave del proveedor de IA no es válida.") from error
            raise ProviderFailedError("La IA no pudo procesar esta solicitud.") from error
        except (errors.ServerError, errors.APIError) as error:
            log.warning("gemini falló: %s", error)
            raise ProviderFailedError("La IA no respondió a tiempo. Inténtalo de nuevo.") from error

        text = response.text or ""
        if not text.strip():
            raise ProviderFailedError("La IA no generó una respuesta para este aporte. Intenta reformularlo.")
        return text
