package models

import "gorm.io/gorm"



// enum role 
type Role string

const (
	Admin Role = "Admin"
	Employee Role = "Employee"
	Client Role = "Client"
)

type User struct {
	gorm.Model

	Name string
	Email *string
	Role Role 
	Password string
}

