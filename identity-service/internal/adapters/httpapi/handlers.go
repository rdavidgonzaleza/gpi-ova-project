package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"

	"identity-service/internal/application"
	"identity-service/internal/domain"
	"identity-service/internal/ports"
)

type Handlers struct {
	Register   *application.RegisterUser
	Login      *application.AuthenticateUser
	GetSession *application.GetActiveSession
	Tokens     ports.TokenIssuer
}

type registerRequest struct {
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handlers) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "INVALID_BODY", "cuerpo de la solicitud inválido")
		return
	}

	role := domain.Role(req.Role)
	if role == "" {
		role = domain.RoleStudent
	}

	user, err := h.Register.Execute(req.Email, req.FullName, req.Password, role)
	if err != nil {
		if errors.Is(err, application.ErrEmailTaken) {
			writeError(w, http.StatusConflict, "EMAIL_TAKEN", err.Error())
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "no fue posible registrar el usuario")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"id":        user.ID,
		"email":     user.Email,
		"full_name": user.FullName,
		"role":      user.Role,
	})
}

func (h *Handlers) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "INVALID_BODY", "cuerpo de la solicitud inválido")
		return
	}

	result, err := h.Login.Execute(req.Email, req.Password)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "credenciales inválidas")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"token": result.Token,
		"user": map[string]any{
			"id":        result.User.ID,
			"email":     result.User.Email,
			"full_name": result.User.FullName,
			"role":      result.User.Role,
		},
	})
}

func (h *Handlers) HandleGetMe(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if len(authHeader) < 8 || authHeader[:7] != "Bearer " {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "token no proporcionado o inválido")
		return
	}
	tokenStr := authHeader[7:]

	userID, _, err := h.Tokens.Verify(tokenStr)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "token inválido o expirado")
		return
	}

	user, err := h.GetSession.Execute(userID)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "usuario no encontrado")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"id":        user.ID,
		"email":     user.Email,
		"full_name": user.FullName,
		"role":      user.Role,
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]any{
		"error": map[string]string{
			"code":    code,
			"message": message,
		},
	})
}
