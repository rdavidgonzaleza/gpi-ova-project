// Package domain contiene las entidades y reglas puras del servicio de
// contenidos (spec 5.2 y 7.2). No importa nada fuera de la librería estándar.
package domain

import (
	"errors"
	"strings"
	"time"
)

type Status string

const (
	StatusDraft     Status = "borrador"
	StatusPublished Status = "publicado"
)

type BlockType string

const (
	BlockText  BlockType = "texto"
	BlockImage BlockType = "imagen"
	BlockVideo BlockType = "video"
)

// Role replica los roles que emite identity-service (spec 3.4).
type Role string

const (
	RoleStudent   Role = "estudiante"
	RoleTeacher   Role = "docente"
	RoleAdmin     Role = "administrador"
	RoleValidator Role = "validador"
)

// CanEditContent indica si el rol puede crear, editar o publicar OVA.
func CanEditContent(r Role) bool { return r == RoleTeacher || r == RoleAdmin }

type OVA struct {
	ID              string
	Title           string
	Description     string
	LearningOutcome string
	Status          Status
	CreatedBy       *string
	CreatedAt       time.Time
	Blocks          []ContentBlock
	Activities      []ActivitySummary
}

type ContentBlock struct {
	ID       string
	OVAID    string
	Type     BlockType
	Position int
	Content  string
}

// ActivitySummary es la tabla `activities` que hoy vive en content-service
// (spec 7.2): solo título, descripción y si usa IA.
type ActivitySummary struct {
	ID          string
	OVAID       string
	Title       string
	Description string
	IsAI        bool
}

type Version struct {
	ID            string
	OVAID         string
	VersionNumber int
	ChangeNotes   *string
	CreatedAt     time.Time
}

var (
	ErrNotFound     = errors.New("OVA no encontrado")
	ErrInvalidField = errors.New("datos del OVA inválidos")
)

// ValidationError describe qué campo incumple las reglas del OVA.
type ValidationError struct{ Message string }

func (e *ValidationError) Error() string { return e.Message }
func (e *ValidationError) Unwrap() error { return ErrInvalidField }

func invalid(msg string) error { return &ValidationError{Message: msg} }

// ValidateHeader exige título, descripción y resultado de aprendizaje.
func ValidateHeader(title, description, outcome string) error {
	if strings.TrimSpace(title) == "" || strings.TrimSpace(description) == "" || strings.TrimSpace(outcome) == "" {
		return invalid("título, descripción y resultado de aprendizaje son obligatorios")
	}
	if len(title) > 255 {
		return invalid("el título no puede superar 255 caracteres")
	}
	return nil
}

// ValidateBlocks revisa tipo, posición y contenido de cada bloque. Los
// bloques imagen y video guardan `url|descripción` (spec 5.3.1).
func ValidateBlocks(blocks []ContentBlock) error {
	for _, b := range blocks {
		switch b.Type {
		case BlockText, BlockImage, BlockVideo:
		default:
			return invalid("tipo de bloque inválido: debe ser texto, imagen o video")
		}
		if b.Position < 0 {
			return invalid("la posición de un bloque no puede ser negativa")
		}
		if strings.TrimSpace(b.Content) == "" {
			return invalid("el contenido de un bloque no puede estar vacío")
		}
		if b.Type != BlockText {
			url, _, _ := strings.Cut(b.Content, "|")
			if strings.TrimSpace(url) == "" {
				return invalid("los bloques imagen y video necesitan una URL")
			}
		}
	}
	return nil
}

func ValidateActivities(activities []ActivitySummary) error {
	for _, a := range activities {
		if strings.TrimSpace(a.Title) == "" {
			return invalid("cada actividad necesita un título")
		}
		if len(a.Title) > 255 {
			return invalid("el título de una actividad no puede superar 255 caracteres")
		}
	}
	return nil
}
