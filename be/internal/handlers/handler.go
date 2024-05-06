package handlers

import (
	"be/internal/repositories"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
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
