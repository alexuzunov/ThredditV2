package models

type Subreddit struct {
	ID          uint    `gorm:"primaryKey"`
	Name        string  `gorm:"uniqueIndex;size:100;not null"`
	Description string  `gorm:"size:255"`
	Privacy     string  `gorm:"size:50;not null"`
	Banner      *string `gorm:"size:255"`
	Icon        *string `gorm:"size:255"`

	// Relationships
	Posts       []Post `gorm:"foreignKey:SubredditID"`
	Subscribers []User `gorm:"many2many:subreddit_subscriptions"`
	Moderators  []User `gorm:"many2many:subreddit_moderators"`
}
