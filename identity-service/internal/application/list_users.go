package application

import (
	"errors"

	"identity-service/internal/domain"
	"identity-service/internal/ports"
)

var (
	ErrForbidden   = errors.New("tu rol no puede consultar el directorio de usuarios")
	ErrInvalidRole = errors.New("rol inválido")
)

// ListUsers es el caso de uso de directorio de usuarios para el panel docente (UC-13).
type ListUsers struct {
	Users ports.UserRepository
}

func (uc *ListUsers) Execute(requester domain.Role, filter domain.Role) ([]*domain.User, error) {
	if !requester.CanListUsers() {
		return nil, ErrForbidden
	}
	if filter != "" && !filter.IsValid() {
		return nil, ErrInvalidRole
	}
	return uc.Users.List(filter)
}
