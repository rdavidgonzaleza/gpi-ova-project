// Package token verifica los tokens que emite identity-service. Es la misma
// lógica de identity-service/internal/adapters/token/hmac_token.go, solo la
// parte de verificación (spec 3.4: cada servicio valida con JWT_SECRET).
package token

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

type HMACVerifier struct{ secret []byte }

func NewHMACVerifier(secret string) *HMACVerifier { return &HMACVerifier{secret: []byte(secret)} }

type claims struct {
	Sub  string `json:"sub"`
	Role string `json:"role"`
	Exp  int64  `json:"exp"`
}

func (v *HMACVerifier) Verify(token string) (ports.Claims, error) {
	payloadB64, sig, ok := strings.Cut(token, ".")
	if !ok || strings.Contains(sig, ".") {
		return ports.Claims{}, errors.New("token con formato inválido")
	}
	if !hmac.Equal([]byte(sig), []byte(Sign(v.secret, payloadB64))) {
		return ports.Claims{}, errors.New("firma inválida")
	}
	payload, err := base64.RawURLEncoding.DecodeString(payloadB64)
	if err != nil {
		return ports.Claims{}, err
	}
	var c claims
	if err := json.Unmarshal(payload, &c); err != nil {
		return ports.Claims{}, err
	}
	if c.Sub == "" || time.Now().Unix() > c.Exp {
		return ports.Claims{}, errors.New("token expirado")
	}
	return ports.Claims{Subject: c.Sub, Role: domain.Role(c.Role)}, nil
}

// Sign firma el payload; se exporta para que las pruebas emitan tokens.
func Sign(secret []byte, payloadB64 string) string {
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(payloadB64))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

// Issue crea un token válido; solo lo usan las pruebas de integración.
func Issue(secret, sub string, role domain.Role, ttl time.Duration) string {
	payload, _ := json.Marshal(claims{Sub: sub, Role: string(role), Exp: time.Now().Add(ttl).Unix()})
	b64 := base64.RawURLEncoding.EncodeToString(payload)
	return b64 + "." + Sign([]byte(secret), b64)
}
