package models

import (
	"time"

	"github.com/google/uuid"
)

type RFQStatus string

const (
	RFQDRAFT     RFQStatus = "DRAFT"
	RFQSUBMITTED RFQStatus = "SUBMITTED"
	RFQRequest   RFQStatus = "REQUEST"
	RFQReviewed  RFQStatus = "REVIEWED"
	RFQRejected  RFQStatus = "REJECTED"
	RFQConverted RFQStatus = "APPROVED"
)

type RFQ struct {
	ID                    uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	RFQNumber             string
	ClientID              uint
	Client                User `gorm:"foreignKey:ClientID"`
	Title                 string
	Description           string
	Status                RFQStatus `gorm:"type:varChar(20);default:'Request'"`
	BudgetEstimate        uint
	Currency              string
	SubmissionDate        time.Time
	EstimatedDelivaryTime time.Time
	Requirements          string
	AdditionalInfo        string
	Attachments           []RFQAttachment
	UserID                User
	CompanyID             Company
	CreatedAt             time.Time
	UpdatedAt             time.Time
	DeletedAt             time.Time
}
