package httpapi

import "net/http"

func NewRouter(h *Handlers) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/auth/register", h.HandleRegister)
	mux.HandleFunc("POST /api/auth/login", h.HandleLogin)
	mux.HandleFunc("GET /api/auth/me", h.HandleGetMe)

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	return withCORS(mux)
}
