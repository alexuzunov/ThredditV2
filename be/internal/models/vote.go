package models

type Vote struct {
	ID    uint `gorm:"primaryKey"`
	Value int  `gorm:"not null"` // 1 for upvote, -1 for downvote

	// Foreign Keys
	UserID    uint  `gorm:"not null"`
	PostID    *uint // Nullable to allow votes on comments
	CommentID *uint // Nullable to allow votes on posts

	// Relationships
	User    User     `gorm:"foreignKey:UserID"`
	Post    *Post    `gorm:"foreignKey:PostID"`
	Comment *Comment `gorm:"foreignKey:CommentID"`
}
