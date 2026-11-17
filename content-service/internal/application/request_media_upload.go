package application

import (
	"context"
	"strings"

	"github.com/google/uuid"

	"content-service/internal/domain"
	"content-service/internal/ports"
)

type MediaUploadInput struct {
	FileName    string
	ContentType string
}

type MediaUpload struct {
	ports.PresignedUpload
	BlockType domain.BlockType
}

// RequestMediaUpload entrega una URL firmada para que el docente suba una
// imagen o un video directo al bucket. El servicio nunca recibe el archivo.
type RequestMediaUpload struct {
	OVAs    ports.OVARepository
	Storage ports.MediaStorage // nil si no hay bucket configurado
}

func (uc *RequestMediaUpload) Execute(ctx context.Context, claims *ports.Claims, ovaID string, in MediaUploadInput) (*MediaUpload, error) {
	if err := requireEditor(claims); err != nil {
		return nil, err
	}
	contentType := strings.ToLower(strings.TrimSpace(in.ContentType))
	blockType, ok := domain.AllowedMediaTypes[contentType]
	if !ok {
		return nil, ErrUnsupportedMedia
	}
	if uc.Storage == nil {
		return nil, ErrStorageUnavailable
	}
	if _, err := uc.OVAs.Get(ctx, ovaID); err != nil {
		return nil, err
	}
	upload, err := uc.Storage.PresignUpload(ctx, domain.MediaKey(ovaID, uuid.NewString(), in.FileName), contentType)
	if err != nil {
		return nil, err
	}
	return &MediaUpload{PresignedUpload: upload, BlockType: blockType}, nil
}
