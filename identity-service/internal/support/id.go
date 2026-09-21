package support

import (
	"github.com/google/uuid"
)

// NewID genera un UUID v4 usando la librería github.com/google/uuid.
func NewID() string {
	return uuid.New().String()
}
