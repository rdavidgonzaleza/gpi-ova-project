package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"identity-service/internal/adapters/hash"
	"identity-service/internal/adapters/httpapi"
	"identity-service/internal/adapters/repository"
	"identity-service/internal/adapters/token"
	"identity-service/internal/application"
)

func main() {
	dbUrl := getEnv("DATABASE_URL", "postgres://user:pass@localhost:5432/identity?sslmode=disable")
	port := getEnv("PORT", "8081")
	secret := getEnv("JWT_SECRET", "cambia-este-secreto-en-produccion")

	users, err := repository.NewPostgresUserRepository(dbUrl)
	if err != nil {
		log.Fatalf("no fue posible abrir la base de datos: %v", err)
	}

	hasher := hash.NewBcryptHasher()
	tokens := token.NewHMACTokenIssuer(secret, 24*time.Hour)

	handlers := &httpapi.Handlers{
		Register:   &application.RegisterUser{Users: users, Hasher: hasher},
		Login:      &application.AuthenticateUser{Users: users, Hasher: hasher, Tokens: tokens},
		GetSession: &application.GetActiveSession{Users: users},
		Tokens:     tokens,
	}

	router := httpapi.NewRouter(handlers)

	log.Printf("servicio de identidad escuchando en :%s", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
