package models

import (
	"time"

	"github.com/google/uuid"
)

type QuotationStatus string

const (
	QuoteDraft    QuotationStatus = "DRAFT"
	QuoteSent     QuotationStatus = "SENT"
	QuoteAccepted QuotationStatus = "ACCEPTED"
	QuoteRejected QuotationStatus = "REJECTED"
)

type Quotation struct {
	ID          uuid.UUID
	QuotationNo uint `json:"quotation_id;autoIncrement"`

	RFQID         uint
	RFQ           *RFQ      `gorm:"foreignKey:RFQID"`
	CreatedBy     uuid.UUID `gorm:"type:uuid;not null"`
	User          User      `gorm:"foriegnKey:CreatedBy"`
	EstimatedCost uint
	TaxAmount     float32
	TotalAmount   float32
	ValidUntil    time.Time
	QuoteStatus   QuotationStatus `gorm:"type: varChar(20);default:DRAFT"`
	Remarks       string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
