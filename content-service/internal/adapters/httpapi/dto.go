package httpapi

import (
	"time"

	"content-service/internal/domain"
)

type blockDTO struct {
	ID       string `json:"id,omitempty"`
	OVAID    string `json:"ova_id,omitempty"`
	Type     string `json:"type"`
	Position int    `json:"position"`
	Content  string `json:"content"`
}

type activityDTO struct {
	ID          string `json:"id,omitempty"`
	OVAID       string `json:"ova_id,omitempty"`
	Title       string `json:"title"`
	Description string `json:"description"`
	IsAI        bool   `json:"is_ai"`
}

type ovaDTO struct {
	ID              string        `json:"id"`
	Title           string        `json:"title"`
	Description     string        `json:"description"`
	LearningOutcome string        `json:"learning_outcome"`
	Status          string        `json:"status"`
	CreatedBy       *string       `json:"created_by"`
	CreatedAt       string        `json:"created_at"`
	Blocks          []blockDTO    `json:"blocks,omitempty"`
	Activities      []activityDTO `json:"activities,omitempty"`
}

type versionDTO struct {
	ID            string  `json:"id"`
	OVAID         string  `json:"ova_id"`
	VersionNumber int     `json:"version_number"`
	ChangeNotes   *string `json:"change_notes"`
	CreatedAt     string  `json:"created_at"`
}

type createRequest struct {
	Title           string        `json:"title"`
	Description     string        `json:"description"`
	LearningOutcome string        `json:"learning_outcome"`
	Blocks          []blockDTO    `json:"blocks"`
	Activities      []activityDTO `json:"activities"`
}

type updateRequest struct {
	Title           *string        `json:"title"`
	Description     *string        `json:"description"`
	LearningOutcome *string        `json:"learning_outcome"`
	Blocks          *[]blockDTO    `json:"blocks"`
	Activities      *[]activityDTO `json:"activities"`
	ChangeNotes     *string        `json:"change_notes"`
}

type mediaRequest struct {
	FileName    string `json:"file_name"`
	ContentType string `json:"content_type"`
}

func iso(t time.Time) string { return t.UTC().Format(time.RFC3339) }

func toOVADTO(o domain.OVA, detail bool) ovaDTO {
	dto := ovaDTO{
		ID: o.ID, Title: o.Title, Description: o.Description, LearningOutcome: o.LearningOutcome,
		Status: string(o.Status), CreatedBy: o.CreatedBy, CreatedAt: iso(o.CreatedAt),
	}
	if detail {
		dto.Blocks = make([]blockDTO, len(o.Blocks))
		for i, b := range o.Blocks {
			dto.Blocks[i] = blockDTO{ID: b.ID, OVAID: b.OVAID, Type: string(b.Type), Position: b.Position, Content: b.Content}
		}
		dto.Activities = make([]activityDTO, len(o.Activities))
		for i, a := range o.Activities {
			dto.Activities[i] = activityDTO{ID: a.ID, OVAID: a.OVAID, Title: a.Title, Description: a.Description, IsAI: a.IsAI}
		}
	}
	return dto
}

func toVersionDTO(v domain.Version) versionDTO {
	return versionDTO{ID: v.ID, OVAID: v.OVAID, VersionNumber: v.VersionNumber, ChangeNotes: v.ChangeNotes, CreatedAt: iso(v.CreatedAt)}
}

func toBlocks(in []blockDTO) []domain.ContentBlock {
	out := make([]domain.ContentBlock, len(in))
	for i, b := range in {
		out[i] = domain.ContentBlock{Type: domain.BlockType(b.Type), Position: b.Position, Content: b.Content}
	}
	return out
}

func toActivities(in []activityDTO) []domain.ActivitySummary {
	out := make([]domain.ActivitySummary, len(in))
	for i, a := range in {
		out[i] = domain.ActivitySummary{Title: a.Title, Description: a.Description, IsAI: a.IsAI}
	}
	return out
}
