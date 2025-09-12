package models

import (
	"gorm.io/gorm"
	"time"
)

type QuotationStatus string 

const (
	Approve QuotationStatus = "APPROVED",
	Rejected QuotationStatus = "REJECTED",
	Pending QuotationStatus = "PENDING",
)

type Quotation struct {
	gorm.Model

	ClientID uint //foreign key
	Client User `gorm:"foreignKey:ClientID"`
	Title string
	Description string
	EstimatedCost uint
	ValidUntil time.Time
	Status QuotationStatus 
} 