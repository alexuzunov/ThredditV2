package repositories

import (
	"be/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type CommentRepository struct {
	*gorm.DB
}

func (c *CommentRepository) CreateComment(comment *models.Comment) error {
	result := c.Create(comment)

	return result.Error
}

func (c *CommentRepository) FindCommentByID(id uint) (models.Comment, error) {
	var comment models.Comment
	result := c.Preload(clause.Associations).First(&comment, id)

	return comment, result.Error
}

func (c *CommentRepository) DeleteCommentByID(id uint) error {
	result := c.Delete(&models.Comment{}, id)

	return result.Error
}

func (c *CommentRepository) AddReply(parent *models.Comment, reply *models.Comment) error {
	result := c.Model(parent).Association("Replies").Append(reply)

	return result
}

func (c *CommentRepository) RemoveReply(parent *models.Comment, reply *models.Comment) error {
	result := c.Model(parent).Association("Replies").Delete(reply)

	return result
}
