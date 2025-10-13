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

	Name          string  `gorm:"not null"`
	Email         *string `gorm:"unique"`
	Password      string  `gorm:"not null" json:"-"`
	Role          Role    `gorm:"type:varchar(20);default:'Client'"`
	CompanyName   string  `gorm:"not null"`
	ContactNumber int     `gorm:"not null"`
}
