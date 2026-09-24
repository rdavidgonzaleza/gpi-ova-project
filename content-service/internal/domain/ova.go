package domain

import "time"

type Status string

const(
	StatusDraft Status = "borrador"
	StatusPublished Status = "publicado"
)

type Ova struct {
	Id string
	Title string
	Description string
	LearningOutcome string
	Status Status
	CreatedBy string
	CreatedAt time.Time
}