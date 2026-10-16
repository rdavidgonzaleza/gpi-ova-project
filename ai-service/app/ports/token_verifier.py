from typing import Protocol

from app.domain.entities import Claims


class TokenVerifier(Protocol):
    def verify(self, token: str) -> Claims | None: ...
