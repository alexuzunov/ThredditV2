package handlers

import (
	"be/internal/helpers"
	"be/internal/models"
	"be/internal/repositories"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type SubredditHandler struct {
	repository *repositories.Repository
}

type SubredditJSON struct {
	Name string
	Type string
	NSFW string
}

func (h *SubredditHandler) SubredditCreate(w http.ResponseWriter, r *http.Request) {
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

	var s SubredditJSON

	err = json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, _ := h.repository.FindByUsername(claims.Username)

	var subredditType models.SubredditType

	switch s.Type {
	case "public":
		subredditType = models.Public
	case "restricted":
		subredditType = models.Restricted
	case "private":
		subredditType = models.Private
	}

	nsfw, err := strconv.ParseBool(s.NSFW)
	if err != nil {
		log.Fatal(err)
	}

	subreddit := models.Subreddit{
		Name:      s.Name,
		Type:      subredditType,
		NSFW:      nsfw,
		CreatorID: user.ID,
	}

	if err := h.repository.CreateSubreddit(&subreddit); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
