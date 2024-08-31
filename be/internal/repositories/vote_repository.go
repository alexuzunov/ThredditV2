package repositories

import (
	"be/internal/models"
	"gorm.io/gorm"
)

type VoteRepository struct {
	*gorm.DB
}

func (v *VoteRepository) CreateVote(vote *models.Vote) error {
	result := v.Create(vote)

	return result.Error
}

func (v *VoteRepository) UpdateVote(vote *models.Vote) error {
	result := v.Save(vote)

	return result.Error
}

func (v *VoteRepository) FindVoteByID(id uint) (models.Vote, error) {
	var vote models.Vote
	result := v.First(&vote, id)

	return vote, result.Error
}

func (v *VoteRepository) DeleteVoteByID(id uint) error {
	result := v.Delete(&models.Vote{}, id)

	return result.Error
}

// FindVoteByUserAndPost finds a vote by a specific user on a specific post
func (v *VoteRepository) FindVoteByUserAndPost(userID uint, postID uint) (models.Vote, error) {
	var vote models.Vote
	result := v.Where("user_id = ? AND post_id = ?", userID, postID).First(&vote)

	return vote, result.Error
}

// FindVoteByUserAndComment finds a vote by a specific user on a specific comment
func (v *VoteRepository) FindVoteByUserAndComment(userID uint, commentID uint) (models.Vote, error) {
	var vote models.Vote
	result := v.Where("user_id = ? AND comment_id = ?", userID, commentID).First(&vote)

	return vote, result.Error
}
