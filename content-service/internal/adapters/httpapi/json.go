package httpapi

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"content-service/internal/application"
	"content-service/internal/domain"
)

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

// writeError usa el formato estándar de la spec 3.3.
func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]any{"error": map[string]string{"code": code, "message": message}})
}

// writeUseCaseError traduce los errores de dominio/aplicación a HTTP.
func writeUseCaseError(w http.ResponseWriter, err error) {
	var invalid *domain.ValidationError
	switch {
	case errors.As(err, &invalid):
		writeError(w, http.StatusBadRequest, "INVALID_BODY", invalid.Message)
	case errors.Is(err, domain.ErrNotFound):
		writeError(w, http.StatusNotFound, "NOT_FOUND", "OVA no encontrado")
	case errors.Is(err, application.ErrUnauthenticated):
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "se requiere un token válido")
	case errors.Is(err, application.ErrForbidden):
		writeError(w, http.StatusForbidden, "FORBIDDEN", err.Error())
	case errors.Is(err, application.ErrUnsupportedMedia):
		writeError(w, http.StatusBadRequest, "UNSUPPORTED_MEDIA_TYPE", err.Error())
	case errors.Is(err, application.ErrStorageUnavailable):
		writeError(w, http.StatusServiceUnavailable, "STORAGE_NOT_CONFIGURED", err.Error())
	default:
		log.Printf("error interno: %v", err)
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "no fue posible completar la operación")
	}
}
