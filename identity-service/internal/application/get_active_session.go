package application

import (
	"errors"

	"identity-service/internal/domain"
	"identity-service/internal/ports"
)

var ErrUserNotFound = errors.New("usuario no encontrado")

// GetActiveSession es el caso de uso UC-02.2: obtener datos del usuario a partir del token.
type GetActiveSession struct {
	Users  ports.UserRepository
}

func (uc *GetActiveSession) Execute(userID string) (*domain.User, error) {
	user, err := uc.Users.FindByID(userID)
	if err != nil || user == nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}
