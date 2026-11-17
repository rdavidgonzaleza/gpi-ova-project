package application

import (
	"context"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

// PublishOVA implementa UC-05: deja el OVA visible para los estudiantes.
type PublishOVA struct{ OVAs ports.OVARepository }

func (uc *PublishOVA) Execute(ctx context.Context, claims *ports.Claims, id string) (*domain.OVA, error) {
	if err := requireEditor(claims); err != nil {
		return nil, err
	}
	if err := uc.OVAs.SetStatus(ctx, id, domain.StatusPublished); err != nil {
		return nil, err
	}
	return uc.OVAs.Get(ctx, id)
}
