package repositories

import (
	"be/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PostRepository struct {
	*gorm.DB
}

func (s *PostRepository) CreatePost(p *models.Post) error {
	result := s.Create(p)

	return result.Error
}

func (s *PostRepository) FindPostByID(id uint) (models.Post, error) {
	var post models.Post
	result := s.Preload(clause.Associations).First(&post, id)

	return post, result.Error
}

func (s *PostRepository) DeletePostByID(id uint) error {
	result := s.Delete(&models.Post{}, id)

	return result.Error
}
