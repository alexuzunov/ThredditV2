package handlers

import (
	"be/internal/helpers"
	"be/internal/models"
	"be/internal/repositories"
	"encoding/json"
	"net/http"
)

type PostHandler struct {
	repository *repositories.Repository
}

type PostJSON struct {
	Subreddit   string
	Title       string
	Description string
	Image       string
	ImageType   string
}

func (h *PostHandler) PostCreate(w http.ResponseWriter, r *http.Request) {
	tokenString := r.Header.Get("Authorization")

	if tokenString == "" {
		http.Error(w, "Missing authorization header", http.StatusUnauthorized)
		return
	}

	tokenString = tokenString[len("Bearer "):]

	claims, err := helpers.VerifyToken(tokenString)

	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	var p PostJSON

	err = json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, _ := h.repository.FindByUsername(claims.Username)

	post := models.Post{
		Title:         p.Title,
		Text:          p.Description,
		AuthorID:      user.ID,
		SubredditName: p.Subreddit,
	}

	if err := h.repository.CreatePost(&post); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
