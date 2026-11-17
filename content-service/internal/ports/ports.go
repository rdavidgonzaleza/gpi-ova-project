package ports

import (
	"context"
	"time"

	"content-service/internal/domain"
)

// OVARepository es el puerto de salida hacia la persistencia de OVA.
type OVARepository interface {
	List(ctx context.Context) ([]domain.OVA, error)
	// Get devuelve el OVA con sus bloques (ordenados por posición) y
	// actividades, o domain.ErrNotFound.
	Get(ctx context.Context, id string) (*domain.OVA, error)
	// Create guarda el OVA, sus bloques, actividades y la versión inicial.
	Create(ctx context.Context, ova *domain.OVA, version domain.Version) error
	// Update reemplaza los campos del OVA (y bloques/actividades si no son
	// nil) y registra la versión, todo en una transacción.
	Update(ctx context.Context, ova *domain.OVA, replaceBlocks, replaceActivities bool, version domain.Version) error
	SetStatus(ctx context.Context, id string, status domain.Status) error
	// Versions devuelve las versiones de la más reciente a la más antigua.
	Versions(ctx context.Context, ovaID string) ([]domain.Version, error)
	NextVersionNumber(ctx context.Context, ovaID string) (int, error)
}

// Claims son los datos que el servicio necesita del token (spec 3.4).
type Claims struct {
	Subject string
	Role    domain.Role
}

// TokenVerifier valida la firma HMAC y la expiración del token.
type TokenVerifier interface {
	Verify(token string) (Claims, error)
}

// PresignedUpload es una URL temporal para subir un archivo directo al bucket.
type PresignedUpload struct {
	UploadURL string
	PublicURL string
	Key       string
	ExpiresAt time.Time
}

// MediaStorage es el puerto hacia el almacenamiento de objetos compatible con
// S3 (Backblaze B2 en la v1).
type MediaStorage interface {
	PresignUpload(ctx context.Context, key, contentType string) (PresignedUpload, error)
}
