package application

import (
	"context"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

type GetOVA struct{ OVAs ports.OVARepository }

func (uc *GetOVA) Execute(ctx context.Context, id string) (*domain.OVA, error) {
	return uc.OVAs.Get(ctx, id)
}
