package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var buildVersion = "dev"

type VersionResponse struct {
	Version     string `json:"version"`
	Environment string `json:"environment"`
}

type VisitsResponse struct {
	Count int64 `json:"count"`
}

var db *pgxpool.Pool

func main() {
	ctx := context.Background()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is required")
	}

	var err error
	for i := 0; i < 30; i++ {
		db, err = pgxpool.New(ctx, dsn)
		if err == nil {
			if err = db.Ping(ctx); err == nil {
				break
			}
		}
		log.Printf("waiting for postgres (%d/30): %v", i+1, err)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		log.Fatalf("cannot connect to postgres: %v", err)
	}
	defer db.Close()

	if _, err := db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS visits (
			id BIGSERIAL PRIMARY KEY,
			visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(r.Context()); err != nil {
			w.WriteHeader(http.StatusServiceUnavailable)
			w.Write([]byte("db unavailable"))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("/api/version", func(w http.ResponseWriter, r *http.Request) {
		v := buildVersion
		if len(v) > 7 {
			v = v[:7]
		}
		resp := VersionResponse{
			Version:     v,
			Environment: env("APP_ENV", "unknown"),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})

	mux.HandleFunc("/api/visit", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		if _, err := db.Exec(r.Context(), `INSERT INTO visits DEFAULT VALUES`); err != nil {
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc("/api/visits", func(w http.ResponseWriter, r *http.Request) {
		var count int64
		if err := db.QueryRow(r.Context(), `SELECT COUNT(*) FROM visits`).Scan(&count); err != nil {
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(VisitsResponse{Count: count})
	})

	addr := ":8080"
	log.Printf("listening on %s (version=%s)", addr, buildVersion)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
