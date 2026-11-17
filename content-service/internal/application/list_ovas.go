package application

import (
	"context"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

type ListOVAs struct{ OVAs ports.OVARepository }

func (uc *ListOVAs) Execute(ctx context.Context) ([]domain.OVA, error) {
	return uc.OVAs.List(ctx)
}
