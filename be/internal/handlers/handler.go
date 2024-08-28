package handlers

import (
	"be/internal/repositories"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"net/http"
)

type Handler struct {
	*chi.Mux

	repository *repositories.Repository
}

func NewHandler(repository *repositories.Repository) *Handler {
	h := &Handler{
		Mux:        chi.NewMux(),
		repository: repository,
	}

	users := UserHandler{repository: repository}
	subreddits := SubredditHandler{repository: repository}
	posts := PostHandler{repository: repository}

	h.Use(middleware.Logger)
	h.Use(middleware.Recoverer)
	h.Use(middleware.AllowContentType("application/json"))

	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	h.Use(corsOptions.Handler)

	h.Post("/api/register", func(w http.ResponseWriter, r *http.Request) {
		users.Register(w, r)
	})

	h.Post("/api/login", func(w http.ResponseWriter, r *http.Request) {
		users.Login(w, r)
	})

	h.Post("/api/subreddits", func(w http.ResponseWriter, r *http.Request) {
		subreddits.SubredditCreate(w, r)
	})

	h.Post("/api/posts", func(w http.ResponseWriter, r *http.Request) {
		posts.PostCreate(w, r)
	})

	return h
}
