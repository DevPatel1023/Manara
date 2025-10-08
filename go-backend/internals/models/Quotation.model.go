package models

import (
	"time"

	"gorm.io/gorm"
)

type QuotationStatus string

const (
	Approve  QuotationStatus = "APPROVED"
	Rejected QuotationStatus = "REJECTED"
	Pending  QuotationStatus = "PENDING"
)

type Quotation struct {
	gorm.Model

	RFQID         uint
	RFQ           *RFQ `gorm:"foreignKey:RFQID"`
	EstimatedCost uint
	ValidUntil    time.Time
	Status        QuotationStatus
}
