package models

import (
	"time"
)

type Comment struct {
	ID        uint   `gorm:"primaryKey"`
	Content   string `gorm:"type:text;not null"`
	CreatedAt time.Time
	UpdatedAt time.Time

	// Foreign Keys
	UserID   uint  `gorm:"not null"`
	PostID   uint  `gorm:"not null"`
	ParentID *uint `gorm:"index"`

	// Relationships
	User    User      `gorm:"foreignKey:UserID"`
	Post    Post      `gorm:"foreignKey:PostID"`
	Parent  *Comment  `gorm:"foreignKey:ParentID"`
	Replies []Comment `gorm:"foreignKey:ParentID"`
}
