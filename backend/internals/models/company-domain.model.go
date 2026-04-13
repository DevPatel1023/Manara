package models

import "github.com/google/uuid"

type CompanyDomain struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CompanyID Company   `json:"company_id" gorm:"not null;foreignKey:CompanyID"`
	Domain    string    `json:"domain" gorm:"not null"`
}
