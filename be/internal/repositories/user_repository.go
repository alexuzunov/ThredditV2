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

func (s *UserRepository) FindUserByID(id uint) (models.User, error) {
	var user models.User
	result := s.First(&user, id)

	return user, result.Error
}

func (s *UserRepository) FindUserByUsername(username string) (models.User, error) {
	var user models.User
	result := s.Where(&models.User{Username: username}).First(&user)

	return user, result.Error
}

func (s *UserRepository) FollowUser(follower *models.User, followee *models.User) error {
	result := s.Model(followee).Association("Followers").Append(follower)

	return result
}

func (s *UserRepository) UnfollowUser(follower *models.User, followee *models.User) error {
	result := s.Model(followee).Association("Followers").Delete(follower)

	return result
}
