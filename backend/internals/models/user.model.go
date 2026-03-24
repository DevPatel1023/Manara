package models

import "gorm.io/gorm"

// enum role
type Role string

const (
	Admin    Role = "Admin"
	Employee Role = "Employee"
	Client   Role = "Client"
)

type User struct {
	gorm.Model

	Name          string `json:"name" gorm:"not null"`
	Email         string `json:"email" gorm:"unique;not null"`
	Password      string `json:"-" gorm:"not null"`
	Role          Role   `json:"role" gorm:"type:varchar(20);default:'Client'"`
	CompanyName   string `json:"company_name" gorm:"not null;default:'Unknown'"`
	ContactNumber int    `json:"contact_number" gorm:"not null;default:0"`
}
