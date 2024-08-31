package handlers

import (
	"be/internal/repositories"
	"encoding/json"
	"github.com/go-chi/chi"
	"net/http"
	"strconv"
)

type UserHandler struct {
	repository *repositories.Repository
}

func (h *UserHandler) GetActiveUser(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)
	user, _ := h.repository.FindUserByID(userID)

	response := map[string]interface{}{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	}

	w.Header().Set("Content-Type", "application/json")

	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		return
	}
}

func (h *UserHandler) FollowUser(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)
	followeeID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	user, err := h.repository.FindUserByID(userID)
	if err != nil {
		http.Error(w, "Current user not found", http.StatusNotFound)
		return
	}

	followee, err := h.repository.FindUserByID(uint(followeeID))
	if err != nil {
		http.Error(w, "Followed user not found", http.StatusNotFound)
		return
	}

	err = h.repository.FollowUser(&user, &followee)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	_, err = w.Write([]byte("Successfully followed user"))
	if err != nil {
		return
	}
}

func (h *UserHandler) UnfollowUser(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)
	followeeID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	user, err := h.repository.FindUserByID(userID)
	if err != nil {
		http.Error(w, "Current user not found", http.StatusNotFound)
		return
	}

	followee, err := h.repository.FindUserByID(uint(followeeID))
	if err != nil {
		http.Error(w, "Followed user not found", http.StatusNotFound)
		return
	}

	err = h.repository.UnfollowUser(&user, &followee)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	_, err = w.Write([]byte("Successfully unfollowed user"))
	if err != nil {
		return
	}
}
