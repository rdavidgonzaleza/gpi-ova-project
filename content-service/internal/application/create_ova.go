package application

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

type CreateOVAInput struct {
	Title           string
	Description     string
	LearningOutcome string
	Blocks          []domain.ContentBlock
	Activities      []domain.ActivitySummary
}

// CreateOVA implementa UC-03: crea el OVA en borrador con su versión 1.
type CreateOVA struct{ OVAs ports.OVARepository }

func (uc *CreateOVA) Execute(ctx context.Context, claims *ports.Claims, in CreateOVAInput) (*domain.OVA, error) {
	if err := requireEditor(claims); err != nil {
		return nil, err
	}
	if err := domain.ValidateHeader(in.Title, in.Description, in.LearningOutcome); err != nil {
		return nil, err
	}
	if err := domain.ValidateBlocks(in.Blocks); err != nil {
		return nil, err
	}
	if err := domain.ValidateActivities(in.Activities); err != nil {
		return nil, err
	}

	creator := claims.Subject
	ova := &domain.OVA{
		ID:              uuid.NewString(),
		Title:           strings.TrimSpace(in.Title),
		Description:     strings.TrimSpace(in.Description),
		LearningOutcome: strings.TrimSpace(in.LearningOutcome),
		Status:          domain.StatusDraft,
		CreatedBy:       &creator,
		CreatedAt:       time.Now().UTC(),
	}
	ova.Blocks = assignBlocks(ova.ID, in.Blocks)
	ova.Activities = assignActivities(ova.ID, in.Activities)

	notes := "Versión inicial"
	version := domain.Version{ID: uuid.NewString(), OVAID: ova.ID, VersionNumber: 1, ChangeNotes: &notes, CreatedAt: ova.CreatedAt}
	if err := uc.OVAs.Create(ctx, ova, version); err != nil {
		return nil, err
	}
	return ova, nil
}

func assignBlocks(ovaID string, blocks []domain.ContentBlock) []domain.ContentBlock {
	out := make([]domain.ContentBlock, len(blocks))
	for i, b := range blocks {
		b.ID, b.OVAID = uuid.NewString(), ovaID
		out[i] = b
	}
	return out
}

func assignActivities(ovaID string, activities []domain.ActivitySummary) []domain.ActivitySummary {
	out := make([]domain.ActivitySummary, len(activities))
	for i, a := range activities {
		a.ID, a.OVAID = uuid.NewString(), ovaID
		a.Title = strings.TrimSpace(a.Title)
		out[i] = a
	}
	return out
}
