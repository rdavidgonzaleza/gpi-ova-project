package domain

import "time"
	
type OvaVersion struct {
	Id string
	OvaId string
	VersionNumber uint32
	ChangeNotes string
	CreatedAt time.Time
}