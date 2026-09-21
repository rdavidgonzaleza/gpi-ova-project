package domain

import "time"

type Role string

const (
	RoleStudent Role = "estudiante"
	RoleTeacher Role = "docente"
	RoleAdmin   Role = "administrador"
)

type User struct {
	ID           string
	Email        string
	FullName     string
	PasswordHash string
	Role         Role
	CreatedAt    time.Time
}
