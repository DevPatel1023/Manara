package models

import (
	"time"

	"github.com/google/uuid"
)

type Company struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CompanyName string    `json:"company_name" gorm:"not null"`
	Location    string    `json:"location" gorm:"not null"`
	Address     string    `json:"address" gorm:"not null"`
	Email       string    `json:"email" gorm:"not nulll"`
	PhoneNo     string    `json:"phone_no" gorm:"not null"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   time.Time
}
