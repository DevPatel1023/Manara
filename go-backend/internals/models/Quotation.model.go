package models

import (
	"time"

	"gorm.io/gorm"
)

type QuotationStatus string

const (
	QuoteDraft    QuotationStatus = "draft"
	QuoteSent     QuotationStatus = "SENT"
	QuoteAccepted QuotationStatus = "ACCEPTED"
	QuoteRejected QuotationStatus = "REJECTED"
)

type Quotation struct {
	gorm.Model

	RFQID         uint
	RFQ           *RFQ `gorm:"foreignKey:RFQID"`
	EstimatedCost uint
	ValidUntil    time.Time
	QuoteStatus   QuotationStatus
	Remarks       string
}
