package application

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

// UpdateOVAInput lleva solo los campos presentes en el PATCH (nil = sin cambio).
type UpdateOVAInput struct {
	Title           *string
	Description     *string
	LearningOutcome *string
	Blocks          *[]domain.ContentBlock
	Activities      *[]domain.ActivitySummary
	ChangeNotes     *string
}

// UpdateOVA implementa UC-03/UC-04: cada edición guarda una nueva versión.
type UpdateOVA struct{ OVAs ports.OVARepository }

func (uc *UpdateOVA) Execute(ctx context.Context, claims *ports.Claims, id string, in UpdateOVAInput) (*domain.OVA, error) {
	if err := requireEditor(claims); err != nil {
		return nil, err
	}
	ova, err := uc.OVAs.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	if in.Title != nil {
		ova.Title = strings.TrimSpace(*in.Title)
	}
	if in.Description != nil {
		ova.Description = strings.TrimSpace(*in.Description)
	}
	if in.LearningOutcome != nil {
		ova.LearningOutcome = strings.TrimSpace(*in.LearningOutcome)
	}
	if err := domain.ValidateHeader(ova.Title, ova.Description, ova.LearningOutcome); err != nil {
		return nil, err
	}
	if in.Blocks != nil {
		if err := domain.ValidateBlocks(*in.Blocks); err != nil {
			return nil, err
		}
		ova.Blocks = assignBlocks(id, *in.Blocks)
	}
	if in.Activities != nil {
		if err := domain.ValidateActivities(*in.Activities); err != nil {
			return nil, err
		}
		ova.Activities = assignActivities(id, *in.Activities)
	}

	number, err := uc.OVAs.NextVersionNumber(ctx, id)
	if err != nil {
		return nil, err
	}
	var notes *string
	if in.ChangeNotes != nil && strings.TrimSpace(*in.ChangeNotes) != "" {
		trimmed := strings.TrimSpace(*in.ChangeNotes)
		notes = &trimmed
	}
	version := domain.Version{ID: uuid.NewString(), OVAID: id, VersionNumber: number, ChangeNotes: notes, CreatedAt: time.Now().UTC()}

	if err := uc.OVAs.Update(ctx, ova, in.Blocks != nil, in.Activities != nil, version); err != nil {
		return nil, err
	}
	return uc.OVAs.Get(ctx, id)
}
