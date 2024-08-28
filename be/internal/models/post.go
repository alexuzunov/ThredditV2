package models

import (
	"time"
)

type Post struct {
	ID        uint   `gorm:"primaryKey"`
	Title     string `gorm:"size:255;not null"`
	Content   string `gorm:"type:text"`
	CreatedAt time.Time
	UpdatedAt time.Time

	// Foreign Keys
	UserID      uint `gorm:"not null"`
	SubredditID uint `gorm:"not null"`

	// Relationships
	User      User      `gorm:"foreignKey:UserID"`
	Subreddit Subreddit `gorm:"foreignKey:SubredditID"`
	Comments  []Comment `gorm:"foreignKey:PostID"`
	Votes     []Vote    `gorm:"foreignKey:PostID"`
}
