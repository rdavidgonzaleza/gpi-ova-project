package domain

import "time"

type Role string

const (
	RoleStudent   Role = "estudiante"
	RoleTeacher   Role = "docente"
	RoleAdmin     Role = "administrador"
	RoleValidator Role = "validador"
)

// IsValid indica si el rol pertenece al catálogo de la spec (sección 1).
func (r Role) IsValid() bool {
	switch r {
	case RoleStudent, RoleTeacher, RoleAdmin, RoleValidator:
		return true
	}
	return false
}

// CanListUsers indica si el rol puede consultar el directorio de usuarios (UC-13).
func (r Role) CanListUsers() bool {
	return r == RoleTeacher || r == RoleAdmin
}

type User struct {
	ID           string
	Email        string
	FullName     string
	PasswordHash string
	Role         Role
	CreatedAt    time.Time
}
