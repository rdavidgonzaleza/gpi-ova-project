package httpapi

import (
	"encoding/json"
	"net/http"

	"content-service/internal/application"
	"content-service/internal/ports"
)

type Handlers struct {
	List        *application.ListOVAs
	Get         *application.GetOVA
	Create      *application.CreateOVA
	Update      *application.UpdateOVA
	Publish     *application.PublishOVA
	Versions    *application.ListVersions
	MediaUpload *application.RequestMediaUpload
	Tokens      ports.TokenVerifier
}

// maxBody limita el JSON de entrada (los bloques de texto son Markdown).
const maxBody = 2 << 20

func decode(w http.ResponseWriter, r *http.Request, dst any) bool {
	dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, maxBody))
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		writeError(w, http.StatusBadRequest, "INVALID_BODY", "cuerpo de la solicitud inválido")
		return false
	}
	return true
}

func (h *Handlers) HandleList(w http.ResponseWriter, r *http.Request) {
	ovas, err := h.List.Execute(r.Context())
	if err != nil {
		writeUseCaseError(w, err)
		return
	}
	out := make([]ovaDTO, len(ovas))
	for i, o := range ovas {
		out[i] = toOVADTO(o, false)
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *Handlers) HandleGet(w http.ResponseWriter, r *http.Request) {
	ova, err := h.Get.Execute(r.Context(), r.PathValue("id"))
	if err != nil {
		writeUseCaseError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, toOVADTO(*ova, true))
}

func (h *Handlers) HandleCreate(w http.ResponseWriter, r *http.Request) {
	claims := claimsFrom(r, h.Tokens)
	if claims == nil {
		writeUseCaseError(w, application.ErrUnauthenticated)
		return
	}
	var req createRequest
	if !decode(w, r, &req) {
		return
	}
	ova, err := h.Create.Execute(r.Context(), claims, application.CreateOVAInput{
		Title: req.Title, Description: req.Description, LearningOutcome: req.LearningOutcome,
		Blocks: toBlocks(req.Blocks), Activities: toActivities(req.Activities),
	})
	if err != nil {
		writeUseCaseError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, toOVADTO(*ova, true))
}

func (h *Handlers) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	claims := claimsFrom(r, h.Tokens)
	if claims == nil {
		writeUseCaseError(w, application.ErrUnauthenticated)
		return
	}
	var req updateRequest
	if !decode(w, r, &req) {
		return
	}
	in := application.UpdateOVAInput{
		Title: req.Title, Description: req.Description, LearningOutcome: req.LearningOutcome, ChangeNotes: req.ChangeNotes,
	}
	if req.Blocks != nil {
		blocks := toBlocks(*req.Blocks)
		in.Blocks = &blocks
	}
	if req.Activities != nil {
		activities := toActivities(*req.Activities)
		in.Activities = &activities
	}
	ova, err := h.Update.Execute(r.Context(), claims, r.PathValue("id"), in)
	if err != nil {
		writeUseCaseError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, toOVADTO(*ova, true))
}

func (h *Handlers) HandlePublish(w http.ResponseWriter, r *http.Request) {
	ova, err := h.Publish.Execute(r.Context(), claimsFrom(r, h.Tokens), r.PathValue("id"))
	if err != nil {
		writeUseCaseError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, toOVADTO(*ova, true))
}

func (h *Handlers) HandleVersions(w http.ResponseWriter, r *http.Request) {
	versions, err := h.Versions.Execute(r.Context(), r.PathValue("id"))
	if err != nil {
		writeUseCaseError(w, err)
		return
	}
	out := make([]versionDTO, len(versions))
	for i, v := range versions {
		out[i] = toVersionDTO(v)
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *Handlers) HandleMediaUpload(w http.ResponseWriter, r *http.Request) {
	claims := claimsFrom(r, h.Tokens)
	if claims == nil {
		writeUseCaseError(w, application.ErrUnauthenticated)
		return
	}
	var req mediaRequest
	if !decode(w, r, &req) {
		return
	}
	up, err := h.MediaUpload.Execute(r.Context(), claims, r.PathValue("id"), application.MediaUploadInput{
		FileName: req.FileName, ContentType: req.ContentType,
	})
	if err != nil {
		writeUseCaseError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{
		"upload_url":   up.UploadURL,
		"public_url":   up.PublicURL,
		"key":          up.Key,
		"block_type":   up.BlockType,
		"content_type": req.ContentType,
		"expires_at":   iso(up.ExpiresAt),
	})
}
