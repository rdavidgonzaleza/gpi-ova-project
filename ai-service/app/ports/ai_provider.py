from typing import Protocol


class AIProvider(Protocol):
    """Puerto hacia el modelo generativo (RF-11: el proveedor es intercambiable).

    Las implementaciones traducen sus fallas a ProviderUnavailableError,
    ProviderRateLimitedError o ProviderFailedError del dominio.
    """

    name: str

    def generate(self, prompt: str, *, system: str, expects_json: bool) -> str: ...
