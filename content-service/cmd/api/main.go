package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"content-service/internal/adapters/httpapi"
	"content-service/internal/adapters/repository"
	"content-service/internal/adapters/storage"
	"content-service/internal/adapters/token"
	"content-service/internal/application"
	"content-service/internal/ports"
)

func main() {
	dbURL := getEnv("DATABASE_URL", "postgres://gpi:gpi@localhost:55432/content?sslmode=disable")
	port := getEnv("PORT", "8082")
	secret := getEnv("JWT_SECRET", "cambia-este-secreto-en-produccion")

	ovas, err := repository.NewPostgresOVARepository(dbURL)
	if err != nil {
		log.Fatalf("no fue posible abrir la base de datos: %v", err)
	}

	var media ports.MediaStorage
	cfg := storage.Config{
		Endpoint:        os.Getenv("S3_ENDPOINT"),
		Region:          os.Getenv("S3_REGION"),
		Bucket:          os.Getenv("S3_BUCKET"),
		AccessKeyID:     os.Getenv("S3_ACCESS_KEY_ID"),
		SecretAccessKey: os.Getenv("S3_SECRET_ACCESS_KEY"),
		PublicBaseURL:   os.Getenv("MEDIA_PUBLIC_BASE_URL"),
		Expires:         15 * time.Minute,
	}
	if cfg.Configured() {
		presigner, err := storage.NewS3Presigner(cfg)
		if err != nil {
			log.Fatalf("configuración de almacenamiento inválida: %v", err)
		}
		media = presigner
		log.Printf("almacenamiento de archivos: bucket %s en %s", cfg.Bucket, cfg.Endpoint)
	} else {
		log.Printf("almacenamiento de archivos sin configurar: POST /api/ovas/{id}/media responderá 503")
	}

	handlers := &httpapi.Handlers{
		List:        &application.ListOVAs{OVAs: ovas},
		Get:         &application.GetOVA{OVAs: ovas},
		Create:      &application.CreateOVA{OVAs: ovas},
		Update:      &application.UpdateOVA{OVAs: ovas},
		Publish:     &application.PublishOVA{OVAs: ovas},
		Versions:    &application.ListVersions{OVAs: ovas},
		MediaUpload: &application.RequestMediaUpload{OVAs: ovas, Storage: media},
		Tokens:      token.NewHMACVerifier(secret),
	}

	log.Printf("servicio de contenidos escuchando en :%s", port)
	if err := http.ListenAndServe(":"+port, httpapi.NewRouter(handlers)); err != nil {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
