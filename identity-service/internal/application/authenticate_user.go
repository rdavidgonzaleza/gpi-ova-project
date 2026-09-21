package application

import (
	"errors"

	"identity-service/internal/domain"
	"identity-service/internal/ports"
)

var ErrInvalidCredentials = errors.New("credenciales inválidas")

// AuthenticateUser es el caso de uso UC-02: iniciar sesión y emitir un token.
type AuthenticateUser struct {
	Users  ports.UserRepository
	Hasher ports.PasswordHasher
	Tokens ports.TokenIssuer
}

type AuthResult struct {
	Token string
	User  *domain.User
}

func (uc *AuthenticateUser) Execute(email, password string) (*AuthResult, error) {
	user, err := uc.Users.FindByEmail(email)
	if err != nil || user == nil {
		return nil, ErrInvalidCredentials
	}

	if err := uc.Hasher.Compare(user.PasswordHash, password); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := uc.Tokens.Issue(user.ID, user.Role)
	if err != nil {
		return nil, err
	}

	return &AuthResult{Token: token, User: user}, nil
}
