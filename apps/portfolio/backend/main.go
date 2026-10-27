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
var db *pgxpool.Pool

type VersionResponse struct {
	Version     string `json:"version"`
	Environment string `json:"environment"`
}

type VisitPayload struct {
	Path      string `json:"path"`
	Referrer  string `json:"referrer"`
	UserAgent string `json:"user_agent"`
	VisitorID string `json:"visitor_id"`
}

type DailyStat struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

type StatsResponse struct {
	TotalVisits    int64       `json:"total_visits"`
	UniqueVisitors int64       `json:"unique_visitors"`
	DailyStats     []DailyStat `json:"daily_stats"`
}

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

	// Migration de secours au démarrage (pour éviter les erreurs si la table n'existe pas)
	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS visits (
			id BIGSERIAL PRIMARY KEY,
			visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			path VARCHAR(255) DEFAULT '/',
			referrer VARCHAR(255) DEFAULT 'direct',
			user_agent TEXT,
			visitor_id UUID
		)
	`)

	mux := http.NewServeMux()

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(r.Context()); err != nil {
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	mux.HandleFunc("/api/version", func(w http.ResponseWriter, r *http.Request) {
		v := buildVersion
		if len(v) > 7 { v = v[:7] }
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(VersionResponse{Version: v, Environment: env("APP_ENV", "unknown")})
	})

	// ROUTE : Enregistrer une visite
	mux.HandleFunc("/api/visit", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var p VisitPayload
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			p.Path = "/"
			p.Referrer = "direct"
		}

		_, err := db.Exec(r.Context(), 
			`INSERT INTO visits (path, referrer, user_agent, visitor_id) VALUES ($1, $2, $3, $4)`,
			p.Path, p.Referrer, r.UserAgent(), p.VisitorID)

		if err != nil {
			log.Printf("DB error: %v", err)
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	})

	// ROUTE : Les statistiques pour le Dashboard
	mux.HandleFunc("/api/stats", func(w http.ResponseWriter, r *http.Request) {
		var stats StatsResponse

		// Total des visites
		db.QueryRow(r.Context(), `SELECT COUNT(*) FROM visits`).Scan(&stats.TotalVisits)
		
		// Visiteurs uniques
		db.QueryRow(r.Context(), `SELECT COUNT(DISTINCT visitor_id) FROM visits WHERE visitor_id IS NOT NULL`).Scan(&stats.UniqueVisitors)

		// Visites par jour (14 derniers jours)
		rows, err := db.Query(r.Context(), `
			SELECT TO_CHAR(DATE(visited_at), 'YYYY-MM-DD') as jour, COUNT(*) 
			FROM visits 
			WHERE visited_at >= NOW() - INTERVAL '14 days'
			GROUP BY DATE(visited_at) 
			ORDER BY jour ASC
		`)
		if err == nil {
			defer rows.Close()
			stats.DailyStats = []DailyStat{}
			for rows.Next() {
				var d DailyStat
				if err := rows.Scan(&d.Date, &d.Count); err == nil {
					stats.DailyStats = append(stats.DailyStats, d)
				}
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
	})

	// Ancienne route conservée pour compatibilité
	mux.HandleFunc("/api/visits", func(w http.ResponseWriter, r *http.Request) {
		var count int64
		db.QueryRow(r.Context(), `SELECT COUNT(*) FROM visits`).Scan(&count)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]int64{"count": count})
	})

	addr := ":8080"
	log.Printf("listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" { return v }
	return fallback
}
