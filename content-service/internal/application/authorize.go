package application

import (
	"content-service/internal/domain"
	"content-service/internal/ports"
)

// requireEditor aplica la regla de spec 3.4: las escrituras exigen token y
// solo docentes o administradores alteran el catálogo (US-3.1).
func requireEditor(claims *ports.Claims) error {
	if claims == nil {
		return ErrUnauthenticated
	}
	if !domain.CanEditContent(claims.Role) {
		return ErrForbidden
	}
	return nil
}
