package repositories

import (
	"be/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	*gorm.DB
}

func (s *UserRepository) CreateUser(u *models.User) error {
	result := s.Create(u)

	return result.Error
}

func (s *UserRepository) FindByUsername(username string) (models.User, error) {
	var user models.User
	result := s.Where(&models.User{Username: username}).First(&user)

	return user, result.Error
}
