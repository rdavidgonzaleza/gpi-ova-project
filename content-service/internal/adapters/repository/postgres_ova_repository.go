package repository

import (
	"context"
	"database/sql"
	"errors"

	_ "github.com/lib/pq"

	"content-service/internal/domain"
)

// PostgresOVARepository implementa ports.OVARepository con database/sql.
type PostgresOVARepository struct{ db *sql.DB }

func NewPostgresOVARepository(dsn string) (*PostgresOVARepository, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &PostgresOVARepository{db: db}, nil
}

func (r *PostgresOVARepository) DB() *sql.DB { return r.db }

const ovaColumns = `id, title, description, learning_outcome, status, created_by, created_at`

type scanner interface{ Scan(dest ...any) error }

func scanOVA(s scanner) (*domain.OVA, error) {
	var o domain.OVA
	var createdBy sql.NullString
	if err := s.Scan(&o.ID, &o.Title, &o.Description, &o.LearningOutcome, &o.Status, &createdBy, &o.CreatedAt); err != nil {
		return nil, err
	}
	if createdBy.Valid {
		o.CreatedBy = &createdBy.String
	}
	o.CreatedAt = o.CreatedAt.UTC()
	return &o, nil
}

func (r *PostgresOVARepository) List(ctx context.Context) ([]domain.OVA, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT `+ovaColumns+` FROM ovas ORDER BY created_at, title`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []domain.OVA{}
	for rows.Next() {
		o, err := scanOVA(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *o)
	}
	return out, rows.Err()
}

func (r *PostgresOVARepository) Get(ctx context.Context, id string) (*domain.OVA, error) {
	o, err := scanOVA(r.db.QueryRowContext(ctx, `SELECT `+ovaColumns+` FROM ovas WHERE id::text = $1`, id))
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}

	blocks, err := r.db.QueryContext(ctx,
		`SELECT id, ova_id, type, position, content FROM content_blocks WHERE ova_id = $1 ORDER BY position, id`, o.ID)
	if err != nil {
		return nil, err
	}
	defer blocks.Close()
	o.Blocks = []domain.ContentBlock{}
	for blocks.Next() {
		var b domain.ContentBlock
		if err := blocks.Scan(&b.ID, &b.OVAID, &b.Type, &b.Position, &b.Content); err != nil {
			return nil, err
		}
		o.Blocks = append(o.Blocks, b)
	}
	if err := blocks.Err(); err != nil {
		return nil, err
	}

	acts, err := r.db.QueryContext(ctx,
		`SELECT id, ova_id, title, description, is_ai FROM activities WHERE ova_id = $1 ORDER BY title`, o.ID)
	if err != nil {
		return nil, err
	}
	defer acts.Close()
	o.Activities = []domain.ActivitySummary{}
	for acts.Next() {
		var a domain.ActivitySummary
		if err := acts.Scan(&a.ID, &a.OVAID, &a.Title, &a.Description, &a.IsAI); err != nil {
			return nil, err
		}
		o.Activities = append(o.Activities, a)
	}
	return o, acts.Err()
}

func (r *PostgresOVARepository) Create(ctx context.Context, o *domain.OVA, v domain.Version) error {
	return r.inTx(ctx, func(tx *sql.Tx) error {
		if _, err := tx.ExecContext(ctx,
			`INSERT INTO ovas (`+ovaColumns+`) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
			o.ID, o.Title, o.Description, o.LearningOutcome, o.Status, o.CreatedBy, o.CreatedAt); err != nil {
			return err
		}
		if err := insertChildren(ctx, tx, o, true, true); err != nil {
			return err
		}
		return insertVersion(ctx, tx, v)
	})
}

func (r *PostgresOVARepository) Update(ctx context.Context, o *domain.OVA, replaceBlocks, replaceActivities bool, v domain.Version) error {
	return r.inTx(ctx, func(tx *sql.Tx) error {
		if _, err := tx.ExecContext(ctx,
			`UPDATE ovas SET title = $2, description = $3, learning_outcome = $4 WHERE id = $1`,
			o.ID, o.Title, o.Description, o.LearningOutcome); err != nil {
			return err
		}
		if replaceBlocks {
			if _, err := tx.ExecContext(ctx, `DELETE FROM content_blocks WHERE ova_id = $1`, o.ID); err != nil {
				return err
			}
		}
		if replaceActivities {
			if _, err := tx.ExecContext(ctx, `DELETE FROM activities WHERE ova_id = $1`, o.ID); err != nil {
				return err
			}
		}
		if err := insertChildren(ctx, tx, o, replaceBlocks, replaceActivities); err != nil {
			return err
		}
		return insertVersion(ctx, tx, v)
	})
}

func (r *PostgresOVARepository) SetStatus(ctx context.Context, id string, status domain.Status) error {
	res, err := r.db.ExecContext(ctx, `UPDATE ovas SET status = $2 WHERE id::text = $1`, id, status)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *PostgresOVARepository) Versions(ctx context.Context, ovaID string) ([]domain.Version, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, ova_id, version_number, change_notes, created_at FROM ova_versions
		 WHERE ova_id::text = $1 ORDER BY version_number DESC`, ovaID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []domain.Version{}
	for rows.Next() {
		var v domain.Version
		var notes sql.NullString
		if err := rows.Scan(&v.ID, &v.OVAID, &v.VersionNumber, &notes, &v.CreatedAt); err != nil {
			return nil, err
		}
		if notes.Valid {
			v.ChangeNotes = &notes.String
		}
		v.CreatedAt = v.CreatedAt.UTC()
		out = append(out, v)
	}
	return out, rows.Err()
}

func (r *PostgresOVARepository) NextVersionNumber(ctx context.Context, ovaID string) (int, error) {
	var n int
	err := r.db.QueryRowContext(ctx,
		`SELECT COALESCE(MAX(version_number), 0) + 1 FROM ova_versions WHERE ova_id::text = $1`, ovaID).Scan(&n)
	return n, err
}

func (r *PostgresOVARepository) inTx(ctx context.Context, fn func(*sql.Tx) error) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}
	return tx.Commit()
}

func insertChildren(ctx context.Context, tx *sql.Tx, o *domain.OVA, blocks, activities bool) error {
	if blocks {
		for _, b := range o.Blocks {
			if _, err := tx.ExecContext(ctx,
				`INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ($1,$2,$3,$4,$5)`,
				b.ID, o.ID, b.Type, b.Position, b.Content); err != nil {
				return err
			}
		}
	}
	if activities {
		for _, a := range o.Activities {
			if _, err := tx.ExecContext(ctx,
				`INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ($1,$2,$3,$4,$5)`,
				a.ID, o.ID, a.Title, a.Description, a.IsAI); err != nil {
				return err
			}
		}
	}
	return nil
}

func insertVersion(ctx context.Context, tx *sql.Tx, v domain.Version) error {
	_, err := tx.ExecContext(ctx,
		`INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ($1,$2,$3,$4,$5)`,
		v.ID, v.OVAID, v.VersionNumber, v.ChangeNotes, v.CreatedAt)
	return err
}
