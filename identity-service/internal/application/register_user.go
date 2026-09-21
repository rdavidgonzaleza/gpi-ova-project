package application

import (
	"errors"
	"time"

	"identity-service/internal/domain"
	"identity-service/internal/ports"
	"identity-service/internal/support"
)

var ErrEmailTaken = errors.New("el correo ya está registrado")

// RegisterUser es el caso de uso UC-01: registrar un usuario y asignarle un rol.
type RegisterUser struct {
	Users  ports.UserRepository
	Hasher ports.PasswordHasher
}

func (uc *RegisterUser) Execute(email, fullName, password string, role domain.Role) (*domain.User, error) {
	existing, _ := uc.Users.FindByEmail(email)
	if existing != nil {
		return nil, ErrEmailTaken
	}

	hash, err := uc.Hasher.Hash(password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:           support.NewID(),
		Email:        email,
		FullName:     fullName,
		PasswordHash: hash,
		Role:         role,
		CreatedAt:    time.Now().UTC(),
	}

	if err := uc.Users.Save(user); err != nil {
		return nil, err
	}

	return user, nil
}
