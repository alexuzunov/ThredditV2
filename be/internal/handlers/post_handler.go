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

type PostHandler struct {
	repository *repositories.Repository
}

type PostCreateRequest struct {
	Title     string `json:"title"`
	Content   string `json:"content,omitempty"`
	URL       string `json:"url,omitempty"`
	ImageData string `json:"image,omitempty"` // Base64-encoded image data
	ImageName string `json:"image_name,omitempty"`
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)

	var req PostCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	// Create the Post model
	post := models.Post{
		Title:  req.Title,
		UserID: userID,
	}

	// Assign content, URL, or image depending on the request
	if req.Content != "" {
		post.Content = &req.Content
	}

	if req.URL != "" {
		post.URL = &req.URL
	}

	if req.ImageData != "" && req.ImageName != "" {
		imagePath, err := helpers.SaveImage(req.ImageData, req.ImageName)
		if err != nil {
			http.Error(w, "Failed to save image", http.StatusInternalServerError)
			return
		}
		post.Image = &imagePath
	}

	// Save the post to the database
	if err := h.repository.CreatePost(&post); err != nil {
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}
}

func (h *PostHandler) GetPost(w http.ResponseWriter, r *http.Request) {
	postID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	post, err := h.repository.FindPostByID(uint(postID))
	if err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	err = json.NewEncoder(w).Encode(post)
	if err != nil {
		http.Error(w, "Encoding failed", http.StatusInternalServerError)
		return
	}
}

//func UpdatePost(w http.ResponseWriter, r *http.Request) {
//	postID := chi.URLParam(r, "postID")
//	var post Post
//	if err := db.First(&post, postID).Error; err != nil {
//		http.Error(w, "Post not found", http.StatusNotFound)
//		return
//	}
//
//	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
//		http.Error(w, err.Error(), http.StatusBadRequest)
//		return
//	}
//
//	if err := db.Save(&post).Error; err != nil {
//		http.Error(w, "Failed to update post", http.StatusInternalServerError)
//		return
//	}
//	w.WriteHeader(http.StatusOK)
//}

func (h *PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	postID, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	err = h.repository.DeletePostByID(uint(postID))
	if err != nil {
		http.Error(w, "Failed to delete post", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
