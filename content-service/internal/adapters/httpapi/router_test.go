package httpapi_test

// Pruebas de integración de los endpoints de content-service contra un
// Postgres real. Requieren TEST_DATABASE_URL (ver README); sin ella se omiten.

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"content-service/internal/adapters/httpapi"
	"content-service/internal/adapters/repository"
	"content-service/internal/adapters/storage"
	"content-service/internal/adapters/token"
	"content-service/internal/application"
	"content-service/internal/domain"
	"content-service/internal/ports"
)

const secret = "secreto-de-prueba"

type env struct {
	server  *httptest.Server
	teacher string
	student string
}

func setup(t *testing.T, media ports.MediaStorage) *env {
	t.Helper()
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("TEST_DATABASE_URL no está definida")
	}
	repo, err := repository.NewPostgresOVARepository(dsn)
	if err != nil {
		t.Fatalf("no fue posible conectar: %v", err)
	}
	migration, err := os.ReadFile("../../../migrations/001_create_ovas.sql")
	if err != nil {
		t.Fatal(err)
	}
	db := repo.DB()
	if _, err := db.Exec(string(migration)); err != nil {
		t.Fatal(err)
	}
	if _, err := db.Exec(`TRUNCATE content_blocks, activities, ova_versions, ovas`); err != nil {
		t.Fatal(err)
	}
	h := &httpapi.Handlers{
		List: &application.ListOVAs{OVAs: repo}, Get: &application.GetOVA{OVAs: repo},
		Create: &application.CreateOVA{OVAs: repo}, Update: &application.UpdateOVA{OVAs: repo},
		Publish: &application.PublishOVA{OVAs: repo}, Versions: &application.ListVersions{OVAs: repo},
		MediaUpload: &application.RequestMediaUpload{OVAs: repo, Storage: media},
		Tokens:      token.NewHMACVerifier(secret),
	}
	srv := httptest.NewServer(httpapi.NewRouter(h))
	t.Cleanup(srv.Close)
	return &env{
		server:  srv,
		teacher: token.Issue(secret, "11111111-1111-4111-8111-111111111111", domain.RoleTeacher, time.Hour),
		student: token.Issue(secret, "22222222-2222-4222-8222-222222222222", domain.RoleStudent, time.Hour),
	}
}

func (e *env) do(t *testing.T, method, path, tok string, body any) (int, map[string]any, []any) {
	t.Helper()
	var reader *bytes.Reader
	if body != nil {
		raw, _ := json.Marshal(body)
		reader = bytes.NewReader(raw)
	} else {
		reader = bytes.NewReader(nil)
	}
	req, _ := http.NewRequestWithContext(context.Background(), method, e.server.URL+path, reader)
	if tok != "" {
		req.Header.Set("Authorization", "Bearer "+tok)
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	var raw json.RawMessage
	_ = json.NewDecoder(res.Body).Decode(&raw)
	var obj map[string]any
	var arr []any
	if len(raw) > 0 && raw[0] == '[' {
		_ = json.Unmarshal(raw, &arr)
	} else {
		_ = json.Unmarshal(raw, &obj)
	}
	return res.StatusCode, obj, arr
}

func errorCode(obj map[string]any) string {
	if e, ok := obj["error"].(map[string]any); ok {
		return e["code"].(string)
	}
	return ""
}

var sample = map[string]any{
	"title":            "Gestión del alcance",
	"description":      "EDT y control de cambios",
	"learning_outcome": "Construye una EDT",
	"blocks": []map[string]any{
		{"type": "texto", "position": 2, "content": "## Segundo"},
		{"type": "imagen", "position": 1, "content": "https://cdn/x.svg|Diagrama"},
	},
	"activities": []map[string]any{{"title": "Quiz", "description": "Tres preguntas", "is_ai": false}},
}

func TestCreateRequiresTeacherToken(t *testing.T) {
	e := setup(t, nil)
	if code, obj, _ := e.do(t, "POST", "/api/ovas", "", sample); code != 401 || errorCode(obj) != "UNAUTHORIZED" {
		t.Fatalf("sin token: %d %v", code, obj)
	}
	if code, obj, _ := e.do(t, "POST", "/api/ovas", "no.valido", sample); code != 401 {
		t.Fatalf("token inválido: %d %v", code, obj)
	}
	if code, obj, _ := e.do(t, "POST", "/api/ovas", e.student, sample); code != 403 || errorCode(obj) != "FORBIDDEN" {
		t.Fatalf("estudiante: %d %v", code, obj)
	}
}

func TestCreateValidatesBody(t *testing.T) {
	e := setup(t, nil)
	bad := map[string]any{"title": "", "description": "d", "learning_outcome": "l"}
	if code, obj, _ := e.do(t, "POST", "/api/ovas", e.teacher, bad); code != 400 || errorCode(obj) != "INVALID_BODY" {
		t.Fatalf("título vacío: %d %v", code, obj)
	}
	badBlock := map[string]any{"title": "t", "description": "d", "learning_outcome": "l",
		"blocks": []map[string]any{{"type": "audio", "position": 1, "content": "x"}}}
	if code, _, _ := e.do(t, "POST", "/api/ovas", e.teacher, badBlock); code != 400 {
		t.Fatalf("tipo de bloque inválido: %d", code)
	}
}

func TestOVALifecycle(t *testing.T) {
	e := setup(t, nil)

	code, created, _ := e.do(t, "POST", "/api/ovas", e.teacher, sample)
	if code != 201 {
		t.Fatalf("crear: %d %v", code, created)
	}
	id := created["id"].(string)
	if created["status"] != "borrador" || created["created_by"] != "11111111-1111-4111-8111-111111111111" {
		t.Fatalf("OVA creado inesperado: %v", created)
	}
	if !strings.HasSuffix(created["created_at"].(string), "Z") {
		t.Errorf("created_at debe ser ISO 8601 UTC: %v", created["created_at"])
	}

	code, _, list := e.do(t, "GET", "/api/ovas", "", nil)
	if code != 200 || len(list) != 1 {
		t.Fatalf("listar: %d %v", code, list)
	}

	code, got, _ := e.do(t, "GET", "/api/ovas/"+id, "", nil)
	blocks := got["blocks"].([]any)
	if code != 200 || len(blocks) != 2 || blocks[0].(map[string]any)["type"] != "imagen" {
		t.Fatalf("detalle (bloques ordenados por posición): %d %v", code, got)
	}
	if len(got["activities"].([]any)) != 1 {
		t.Fatalf("actividades: %v", got["activities"])
	}

	if code, _, _ := e.do(t, "GET", "/api/ovas/00000000-0000-4000-8000-000000000000", "", nil); code != 404 {
		t.Fatalf("OVA inexistente: %d", code)
	}
	if code, _, _ := e.do(t, "GET", "/api/ovas/no-es-uuid", "", nil); code != 404 {
		t.Fatalf("id no UUID: %d", code)
	}

	patch := map[string]any{"title": "Alcance v2", "change_notes": "Se agrega video",
		"blocks": []map[string]any{{"type": "video", "position": 1, "content": "https://cdn/v.mp4|Resumen"}}}
	if code, _, _ := e.do(t, "PATCH", "/api/ovas/"+id, e.student, patch); code != 403 {
		t.Fatalf("PATCH estudiante: %d", code)
	}
	code, updated, _ := e.do(t, "PATCH", "/api/ovas/"+id, e.teacher, patch)
	if code != 200 || updated["title"] != "Alcance v2" || len(updated["blocks"].([]any)) != 1 ||
		len(updated["activities"].([]any)) != 1 || updated["description"] != "EDT y control de cambios" {
		t.Fatalf("PATCH: %d %v", code, updated)
	}
	if code, _, _ := e.do(t, "PATCH", "/api/ovas/00000000-0000-4000-8000-000000000000", e.teacher, patch); code != 404 {
		t.Fatalf("PATCH inexistente: %d", code)
	}

	code, _, versions := e.do(t, "GET", "/api/ovas/"+id+"/versions", "", nil)
	if code != 200 || len(versions) != 2 {
		t.Fatalf("versiones: %d %v", code, versions)
	}
	latest := versions[0].(map[string]any)
	if latest["version_number"].(float64) != 2 || latest["change_notes"] != "Se agrega video" {
		t.Fatalf("versión más reciente primero: %v", latest)
	}

	if code, _, _ := e.do(t, "POST", "/api/ovas/"+id+"/publish", "", nil); code != 401 {
		t.Fatalf("publicar sin token: %d", code)
	}
	code, published, _ := e.do(t, "POST", "/api/ovas/"+id+"/publish", e.teacher, nil)
	if code != 200 || published["status"] != "publicado" {
		t.Fatalf("publicar: %d %v", code, published)
	}
}

func TestMediaUpload(t *testing.T) {
	e := setup(t, nil)
	_, created, _ := e.do(t, "POST", "/api/ovas", e.teacher, sample)
	id := created["id"].(string)
	body := map[string]any{"file_name": "Resumen Alcance.mp4", "content_type": "video/mp4"}

	if code, obj, _ := e.do(t, "POST", "/api/ovas/"+id+"/media", e.teacher, body); code != 503 || errorCode(obj) != "STORAGE_NOT_CONFIGURED" {
		t.Fatalf("sin bucket: %d %v", code, obj)
	}

	presigner, _ := storage.NewS3Presigner(storage.Config{
		Endpoint: "https://s3.us-east-005.backblazeb2.com", Region: "us-east-005", Bucket: "hito",
		AccessKeyID: "k", SecretAccessKey: "s",
	})
	e = setup(t, presigner)
	_, created, _ = e.do(t, "POST", "/api/ovas", e.teacher, sample)
	id = created["id"].(string)

	if code, _, _ := e.do(t, "POST", "/api/ovas/"+id+"/media", e.student, body); code != 403 {
		t.Fatalf("estudiante: %d", code)
	}
	if code, obj, _ := e.do(t, "POST", "/api/ovas/"+id+"/media", e.teacher,
		map[string]any{"file_name": "x.exe", "content_type": "application/octet-stream"}); code != 400 || errorCode(obj) != "UNSUPPORTED_MEDIA_TYPE" {
		t.Fatalf("tipo no permitido: %d %v", code, obj)
	}
	code, up, _ := e.do(t, "POST", "/api/ovas/"+id+"/media", e.teacher, body)
	if code != 201 || up["block_type"] != "video" {
		t.Fatalf("subida: %d %v", code, up)
	}
	wantPrefix := "https://s3.us-east-005.backblazeb2.com/hito/ovas/" + id + "/"
	if !strings.HasPrefix(up["public_url"].(string), wantPrefix) || !strings.HasSuffix(up["public_url"].(string), "-resumen-alcance.mp4") {
		t.Fatalf("public_url: %v", up["public_url"])
	}
	if !strings.Contains(up["upload_url"].(string), "X-Amz-Signature=") {
		t.Fatalf("upload_url sin firma: %v", up["upload_url"])
	}
}

func TestHealthz(t *testing.T) {
	e := setup(t, nil)
	res, err := http.Get(e.server.URL + "/healthz")
	if err != nil || res.StatusCode != 200 {
		t.Fatalf("healthz: %v %v", err, res)
	}
}
