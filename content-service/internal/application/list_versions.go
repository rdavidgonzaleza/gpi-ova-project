package application

import (
	"context"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

// ListVersions implementa UC-04: historial de versiones de un OVA.
type ListVersions struct{ OVAs ports.OVARepository }

func (uc *ListVersions) Execute(ctx context.Context, ovaID string) ([]domain.Version, error) {
	if _, err := uc.OVAs.Get(ctx, ovaID); err != nil {
		return nil, err
	}
	return uc.OVAs.Versions(ctx, ovaID)
}
