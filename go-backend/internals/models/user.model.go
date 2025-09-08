package models

import "time"


// enum role 
type Role string

const (
	Admin Role = "Admin"
	Employee Role = "Employee"
	Client Role = "Client"
)

type User struct {
	Id uint `gorm:"primary_key"`
	Name string
	Email *string
	Role Role
	PasswordHash string
	createdAt time.Time 
	updatedAt time.Time 
}

