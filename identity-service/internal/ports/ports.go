package ports

import "identity-service/internal/domain"

// UserRepository es el puerto de salida hacia la persistencia de usuarios.
type UserRepository interface {
	Save(u *domain.User) error
	FindByEmail(email string) (*domain.User, error)
	FindByID(id string) (*domain.User, error)
}

// PasswordHasher es el puerto de salida hacia el algoritmo de hashing.
type PasswordHasher interface {
	Hash(plain string) (string, error)
	Compare(hash, plain string) error
}

// TokenIssuer es el puerto de salida hacia la emisión/verificación de tokens.
type TokenIssuer interface {
	Issue(userID string, role domain.Role) (string, error)
	Verify(token string) (userID string, role domain.Role, err error)
}
