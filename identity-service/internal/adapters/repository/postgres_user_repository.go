package repository

import (
	"database/sql"
	"errors"
	"time"

	"identity-service/internal/domain"

	_ "github.com/lib/pq"
)

type PostgresUserRepository struct {
	db *sql.DB
}

func NewPostgresUserRepository(dataSource string) (*PostgresUserRepository, error) {
	db, err := sql.Open("postgres", dataSource)
	if err != nil {
		return nil, err
	}

	return &PostgresUserRepository{db: db}, nil
}

func (r *PostgresUserRepository) Save(u *domain.User) error {
	_, err := r.db.Exec(
		`INSERT INTO users (id, email, full_name, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
		u.ID, u.Email, u.FullName, u.PasswordHash, string(u.Role), u.CreatedAt,
	)
	return err
}

func (r *PostgresUserRepository) FindByEmail(email string) (*domain.User, error) {
	row := r.db.QueryRow(`SELECT id, email, full_name, password_hash, role, created_at FROM users WHERE email = $1`, email)
	return scanUserPostgres(row)
}

func (r *PostgresUserRepository) FindByID(id string) (*domain.User, error) {
	row := r.db.QueryRow(`SELECT id, email, full_name, password_hash, role, created_at FROM users WHERE id = $1`, id)
	return scanUserPostgres(row)
}

func scanUserPostgres(row *sql.Row) (*domain.User, error) {
	var u domain.User
	var role string
	var createdAt time.Time

	err := row.Scan(&u.ID, &u.Email, &u.FullName, &u.PasswordHash, &role, &createdAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	u.Role = domain.Role(role)
	u.CreatedAt = createdAt

	return &u, nil
}
