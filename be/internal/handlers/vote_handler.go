package handlers

import (
	"be/internal/repositories"
	"encoding/json"
	"errors"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type VoteHandler struct {
	repository *repositories.Repository
}

type VoteRequest struct {
	Value int `json:"value"` // 1 for upvote, -1 for downvote
}

func (h *VoteHandler) VotePost(w http.ResponseWriter, r *http.Request) {
	var voteReq VoteRequest
	userID := r.Context().Value("userID").(uint)

	if err := json.NewDecoder(r.Body).Decode(&voteReq); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	vote, err := h.repository.FindVoteByUserAndPost(userID, uint(postID))
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		http.Error(w, "Error retrieving vote", http.StatusInternalServerError)
		return
	}

	vote.Value = voteReq.Value
	vote.UserID = userID
	*vote.PostID = uint(postID)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		if err = h.repository.CreateVote(&vote); err != nil {
			http.Error(w, "Error creating vote", http.StatusInternalServerError)
			return
		}
	} else {
		if err = h.repository.UpdateVote(&vote); err != nil {
			http.Error(w, "Error updating vote", http.StatusInternalServerError)
			return
		}
	}

	_, err = w.Write([]byte("Successfully registered post vote"))
	if err != nil {
		return
	}
}

func (h *VoteHandler) DeleteVotePost(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)

	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	vote, err := h.repository.FindVoteByUserAndPost(userID, uint(postID))
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		http.Error(w, "Error retrieving vote", http.StatusInternalServerError)
		return
	}

	err = h.repository.DeleteVoteByID(vote.ID)
	if err != nil {
		http.Error(w, "Failed to delete vote", http.StatusInternalServerError)
		return
	}

	_, err = w.Write([]byte("Successfully deleted post vote"))
	if err != nil {
		return
	}
}

func (h *VoteHandler) VoteComment(w http.ResponseWriter, r *http.Request) {
	var voteReq VoteRequest
	userID := r.Context().Value("userID").(uint)

	if err := json.NewDecoder(r.Body).Decode(&voteReq); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	commentID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid comment ID", http.StatusBadRequest)
		return
	}

	vote, err := h.repository.FindVoteByUserAndComment(userID, uint(commentID))
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		http.Error(w, "Error retrieving vote", http.StatusInternalServerError)
		return
	}

	vote.Value = voteReq.Value
	vote.UserID = userID
	*vote.CommentID = uint(commentID)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		if err = h.repository.CreateVote(&vote); err != nil {
			http.Error(w, "Error creating vote", http.StatusInternalServerError)
			return
		}
	} else {
		if err = h.repository.UpdateVote(&vote); err != nil {
			http.Error(w, "Error updating vote", http.StatusInternalServerError)
			return
		}
	}

	_, err = w.Write([]byte("Successfully registered comment vote"))
	if err != nil {
		return
	}
}

func (h *VoteHandler) DeleteVoteComment(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)

	commentID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid comment ID", http.StatusBadRequest)
		return
	}

	vote, err := h.repository.FindVoteByUserAndComment(userID, uint(commentID))
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		http.Error(w, "Error retrieving vote", http.StatusInternalServerError)
		return
	}

	err = h.repository.DeleteVoteByID(vote.ID)
	if err != nil {
		http.Error(w, "Failed to delete vote", http.StatusInternalServerError)
		return
	}

	_, err = w.Write([]byte("Successfully deleted comment vote"))
	if err != nil {
		return
	}
}
