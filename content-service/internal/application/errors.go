package application

import "errors"

var (
	// ErrUnauthenticated: falta el token o no es válido (401).
	ErrUnauthenticated = errors.New("se requiere un token válido")
	// ErrForbidden: el rol no puede modificar contenidos (403).
	ErrForbidden = errors.New("solo docentes y administradores pueden modificar OVA")
	// ErrStorageUnavailable: no hay bucket configurado (503).
	ErrStorageUnavailable = errors.New("el almacenamiento de archivos no está configurado")
	// ErrUnsupportedMedia: tipo de archivo no permitido (400).
	ErrUnsupportedMedia = errors.New("tipo de archivo no permitido: usa PNG, JPEG, WebP, GIF, SVG, MP4 o WebM")
)
