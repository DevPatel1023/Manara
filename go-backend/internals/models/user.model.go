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

	Id uint `gorm:"primary_key"`
	Name string
	Email *string
	Role Role `gorm:"type:enum('Admin','Employee','Client');default:'Client';column:role"`
	Password string
}

