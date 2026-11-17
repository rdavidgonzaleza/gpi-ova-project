package httpapi

import "net/http"

func NewRouter(h *Handlers) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/ovas", h.HandleList)
	mux.HandleFunc("POST /api/ovas", h.HandleCreate)
	mux.HandleFunc("GET /api/ovas/{id}", h.HandleGet)
	mux.HandleFunc("PATCH /api/ovas/{id}", h.HandleUpdate)
	mux.HandleFunc("POST /api/ovas/{id}/publish", h.HandlePublish)
	mux.HandleFunc("GET /api/ovas/{id}/versions", h.HandleVersions)
	mux.HandleFunc("POST /api/ovas/{id}/media", h.HandleMediaUpload)

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	return withCORS(mux)
}
