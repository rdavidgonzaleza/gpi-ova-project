"""Verificación del token de identity-service (spec 3.4).

Formato: base64url(payload) + "." + base64url(HMAC-SHA256(payload, JWT_SECRET)),
igual que identity-service/internal/adapters/token/hmac_token.go.
"""

import base64
import hashlib
import hmac
import json
import time

from app.domain.entities import ROLES, Claims


def _b64decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


class HmacTokenVerifier:
    def __init__(self, secret: str):
        self.secret = secret.encode()

    def verify(self, token: str) -> Claims | None:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload, signature = parts
        expected = hmac.new(self.secret, payload.encode(), hashlib.sha256).digest()
        try:
            if not hmac.compare_digest(_b64decode(signature), expected):
                return None
            claims = json.loads(_b64decode(payload))
        except (ValueError, json.JSONDecodeError):
            return None
        if (
            not isinstance(claims.get("sub"), str)
            or claims.get("role") not in ROLES
            or not isinstance(claims.get("exp"), int)
            or claims["exp"] < time.time()
        ):
            return None
        return Claims(sub=claims["sub"], role=claims["role"])
