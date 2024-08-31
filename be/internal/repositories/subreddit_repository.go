package repositories

import (
	"be/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SubredditRepository struct {
	*gorm.DB
}

func (s *SubredditRepository) CreateSubreddit(sr *models.Subreddit) error {
	result := s.Create(sr)

	return result.Error
}

func (s *SubredditRepository) FindSubredditByID(id uint) (models.Subreddit, error) {
	var subreddit models.Subreddit
	result := s.Preload(clause.Associations).First(&subreddit, id)

	return subreddit, result.Error
}

func (s *SubredditRepository) FindSubredditByName(name string) (models.Subreddit, error) {
	var subreddit models.Subreddit
	result := s.Where("name = ?", name).Preload(clause.Associations).First(&subreddit)

	return subreddit, result.Error
}

func (s *SubredditRepository) DeleteSubredditByID(id uint) error {
	result := s.Delete(&models.Subreddit{}, id)

	return result.Error
}

func (s *SubredditRepository) JoinSubreddit(subscriber *models.User, subreddit *models.Subreddit) error {
	result := s.Model(subscriber).Association("Subscribed").Append(subreddit)

	return result
}

func (s *SubredditRepository) LeaveSubreddit(subscriber *models.User, subreddit *models.Subreddit) error {
	result := s.Model(subscriber).Association("Subscribed").Delete(subreddit)

	return result
}
