package httpapi

import (
	"net/http"
	"strings"

	"content-service/internal/ports"
)

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// claimsFrom devuelve los claims del Bearer token, o nil si no hay token o
// no es válido. Los casos de uso deciden si eso es 401 o 403.
func claimsFrom(r *http.Request, verifier ports.TokenVerifier) *ports.Claims {
	header := r.Header.Get("Authorization")
	raw, ok := strings.CutPrefix(header, "Bearer ")
	if !ok || strings.TrimSpace(raw) == "" {
		return nil
	}
	claims, err := verifier.Verify(strings.TrimSpace(raw))
	if err != nil {
		return nil
	}
	return &claims
}
