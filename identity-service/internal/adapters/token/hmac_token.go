package token

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"identity-service/internal/domain"
)

// HMACTokenIssuer implementa ports.TokenIssuer con un token firmado con
// HMAC-SHA256 (una versión simplificada de JWT, sin dependencias externas):
// payload_base64url + "." + firma_base64url.
type HMACTokenIssuer struct {
	secret []byte
	ttl    time.Duration
}

func NewHMACTokenIssuer(secret string, ttl time.Duration) *HMACTokenIssuer {
	return &HMACTokenIssuer{secret: []byte(secret), ttl: ttl}
}

type claims struct {
	Sub  string      `json:"sub"`
	Role domain.Role `json:"role"`
	Exp  int64       `json:"exp"`
}

func (t *HMACTokenIssuer) Issue(userID string, role domain.Role) (string, error) {
	c := claims{Sub: userID, Role: role, Exp: time.Now().Add(t.ttl).Unix()}

	payload, err := json.Marshal(c)
	if err != nil {
		return "", err
	}

	payloadB64 := base64.RawURLEncoding.EncodeToString(payload)
	sig := t.sign(payloadB64)

	return payloadB64 + "." + sig, nil
}

func (t *HMACTokenIssuer) Verify(token string) (string, domain.Role, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return "", "", errors.New("token con formato inválido")
	}

	payloadB64, sig := parts[0], parts[1]
	if !hmac.Equal([]byte(sig), []byte(t.sign(payloadB64))) {
		return "", "", errors.New("firma inválida")
	}

	payload, err := base64.RawURLEncoding.DecodeString(payloadB64)
	if err != nil {
		return "", "", err
	}

	var c claims
	if err := json.Unmarshal(payload, &c); err != nil {
		return "", "", err
	}

	if time.Now().Unix() > c.Exp {
		return "", "", errors.New("token expirado")
	}

	return c.Sub, c.Role, nil
}

func (t *HMACTokenIssuer) sign(payloadB64 string) string {
	mac := hmac.New(sha256.New, t.secret)
	mac.Write([]byte(payloadB64))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}
