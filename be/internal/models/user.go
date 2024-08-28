package models

type UserRole string

const (
	RoleRedditor UserRole = "redditor"
	RoleAdmin    UserRole = "admin"
)

type User struct {
	ID       uint     `gorm:"primaryKey"`
	Username string   `gorm:"uniqueIndex;size:100;not null"`
	Email    string   `gorm:"uniqueIndex;size:100;not null"`
	Password string   `gorm:"not null"`
	Role     UserRole `gorm:"type:varchar(20);default:'user'"`
	Avatar   string   `gorm:"size:255"`
	Bio      string   `gorm:"size:255"`

	// Relationships
	Posts         []Post      `gorm:"foreignKey:UserID"`
	Comments      []Comment   `gorm:"foreignKey:UserID"`
	Votes         []Vote      `gorm:"foreignKey:UserID"`
	Following     []User      `gorm:"many2many:user_followers;joinForeignKey:FollowerID;JoinReferences:FollowedID"`
	Followers     []User      `gorm:"many2many:user_followers;joinForeignKey:FollowedID;JoinReferences:FollowerID"`
	Subscriptions []Subreddit `gorm:"many2many:subreddit_subscriptions"`
	Moderating    []Subreddit `gorm:"many2many:subreddit_moderators"`
}
