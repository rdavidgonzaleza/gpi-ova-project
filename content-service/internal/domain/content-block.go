package domain

import "time"

type ContentBlock struct {
	ID              string
	Title           string
	Description     string
	LearningOutcome string
	Status          string
	CreatedBy       string
	CreatedAt       time.Time
}
