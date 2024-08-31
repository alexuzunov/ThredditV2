package handlers

import (
	"be/internal/helpers"
	"be/internal/models"
	"be/internal/repositories"
	"encoding/json"
	"github.com/go-chi/chi"
	"net/http"
	"strconv"
)

type SubredditHandler struct {
	repository *repositories.Repository
}

type SubredditCreateRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
	Privacy     string `json:"privacy" binding:"required"`
	BannerData  string `json:"banner_image,omitempty"`
	BannerName  string `json:"banner_name,omitempty"`
	IconData    string `json:"icon_image,omitempty"`
	IconName    string `json:"icon_name,omitempty"`
}

func (h *SubredditHandler) CreateSubreddit(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)

	user, err := h.repository.FindUserByID(userID)
	if err != nil {
		http.Error(w, "Current user not found", http.StatusNotFound)
		return
	}

	var req SubredditCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	existingSubreddit, _ := h.repository.FindSubredditByName(req.Name)
	if existingSubreddit.ID != 0 {
		http.Error(w, "Subreddit with this name already exists", http.StatusConflict)
		return
	}

	// Create a new subreddit instance
	subreddit := models.Subreddit{
		Name:        req.Name,
		Description: req.Description,
		Privacy:     req.Privacy,
		Moderators:  []models.User{user},
		Subscribers: []models.User{user},
	}

	if req.BannerData != "" && req.BannerName != "" {
		imagePath, err := helpers.SaveImage(req.BannerData, req.BannerName)
		if err != nil {
			http.Error(w, "Failed to save image", http.StatusInternalServerError)
			return
		}
		subreddit.Banner = &imagePath
	}

	if req.IconData != "" && req.IconName != "" {
		imagePath, err := helpers.SaveImage(req.IconData, req.IconName)
		if err != nil {
			http.Error(w, "Failed to save image", http.StatusInternalServerError)
			return
		}
		subreddit.Icon = &imagePath
	}

	// Save the subreddit to the database
	if err := h.repository.CreateSubreddit(&subreddit); err != nil {
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}
}

func (h *SubredditHandler) GetSubreddit(w http.ResponseWriter, r *http.Request) {
	subredditID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	subreddit, err := h.repository.FindSubredditByID(uint(subredditID))
	if err != nil {
		http.Error(w, "Subreddit not found", http.StatusNotFound)
		return
	}

	err = json.NewEncoder(w).Encode(subreddit)
	if err != nil {
		http.Error(w, "Encoding failed", http.StatusInternalServerError)
		return
	}
}

//func UpdateSubreddit(w http.ResponseWriter, r *http.Request) {
//	subredditID := chi.URLParam(r, "subredditID")
//	var subreddit Subreddit
//	if err := db.First(&subreddit, subredditID).Error; err != nil {
//		http.Error(w, "Subreddit not found", http.StatusNotFound)
//		return
//	}
//
//	if err := json.NewDecoder(r.Body).Decode(&subreddit); err != nil {
//		http.Error(w, err.Error(), http.StatusBadRequest)
//		return
//	}
//
//	if err := db.Save(&subreddit).Error; err != nil {
//		http.Error(w, "Failed to update subreddit", http.StatusInternalServerError)
//		return
//	}
//	w.WriteHeader(http.StatusOK)
//}

func (h *SubredditHandler) DeleteSubreddit(w http.ResponseWriter, r *http.Request) {
	subredditID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	err = h.repository.DeleteSubredditByID(uint(subredditID))
	if err != nil {
		http.Error(w, "Failed to delete subreddit", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *SubredditHandler) JoinSubreddit(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)
	subredditID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	user, err := h.repository.FindUserByID(userID)
	if err != nil {
		http.Error(w, "Current user not found", http.StatusNotFound)
		return
	}

	subreddit, err := h.repository.FindSubredditByID(uint(subredditID))
	if err != nil {
		http.Error(w, "Subreddit not found", http.StatusNotFound)
		return
	}

	err = h.repository.JoinSubreddit(&user, &subreddit)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	_, err = w.Write([]byte("Successfully joined subreddit"))
	if err != nil {
		return
	}
}

func (h *SubredditHandler) LeaveSubreddit(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)
	subredditID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	user, err := h.repository.FindUserByID(userID)
	if err != nil {
		http.Error(w, "Current user not found", http.StatusNotFound)
		return
	}

	subreddit, err := h.repository.FindSubredditByID(uint(subredditID))
	if err != nil {
		http.Error(w, "Subreddit not found", http.StatusNotFound)
		return
	}

	err = h.repository.LeaveSubreddit(&user, &subreddit)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	_, err = w.Write([]byte("Successfully left subreddit"))
	if err != nil {
		return
	}
}
