package models

import (
	"time"
)

// Post represents a post in the application
type Post struct {
	ID        uint    `gorm:"primaryKey"`
	Title     string  `gorm:"size:255;not null"` // Title is required
	Content   *string `gorm:"type:text"`         // Optional text content
	URL       *string `gorm:"size:255"`          // Optional URL, must be a valid URL format
	Image     *string `gorm:"size:255"`          // Optional image, stored as a file path or URL
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
