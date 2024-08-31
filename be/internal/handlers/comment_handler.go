package handlers

import (
	"be/internal/repositories"
	"encoding/json"
	"github.com/go-chi/chi"
	"net/http"
	"strconv"
)

type CommentHandler struct {
	repository *repositories.Repository
}

func CreateComment(w http.ResponseWriter, r *http.Request) {
	var comment Comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := db.Create(&comment).Error; err != nil {
		http.Error(w, "Failed to create comment", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

//func GetComment(w http.ResponseWriter, r *http.Request) {
//	commentID := chi.URLParam(r, "commentID")
//	var comment Comment
//	if err := db.Preload("Replies").First(&comment, commentID).Error; err != nil {
//		http.Error(w, "Comment not found", http.StatusNotFound)
//		return
//	}
//	json.NewEncoder(w).Encode(comment)
//}

//func UpdateComment(w http.ResponseWriter, r *http.Request) {
//	commentID := chi.URLParam(r, "commentID")
//	var comment Comment
//	if err := db.First(&comment, commentID).Error; err != nil {
//		http.Error(w, "Comment not found", http.StatusNotFound)
//		return
//	}
//
//	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
//		http.Error(w, err.Error(), http.StatusBadRequest)
//		return
//	}
//
//	if err := db.Save(&comment).Error; err != nil {
//		http.Error(w, "Failed to update comment", http.StatusInternalServerError)
//		return
//	}
//	w.WriteHeader(http.StatusOK)
//}

func (h *CommentHandler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	commentID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	err = h.repository.DeletePostByID(uint(commentID))
	if err != nil {
		http.Error(w, "Failed to delete comment", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
