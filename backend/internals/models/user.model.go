package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// enum role
type Role string

const (
	Admin    Role = "Admin"
	Employee Role = "Employee"
	Client   Role = "Client"
)

type User struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name          string    `json:"name" gorm:"not null"`
	Email         string    `json:"email" gorm:"unique;not null"`
	Password      string    `json:"-" gorm:"not null"`
	Role          Role      `json:"role" gorm:"type:varchar(20);default:'Client'"`
	CompanyID     uuid.UUID `json:"company_id" gorm:"not null;foreignKey"`
	ContactNumber int       `json:"contact_number" gorm:"not null;default:0"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
}
