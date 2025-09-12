package models

import(
	"gorm.io/gorm",
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models/user")

type Status string 

const (
	Approve Status = "APPROVED",
	Rejected Status = "REJECTED",
	Pending Status = "PENDING",
)

type Quotation struct {
	gorm.Model

	ClientID uint //foreign key
	Client User `gorm:"foreignKey:ClientID"`
	Title string
	Description string
	EstimatedCost uint
	ValidUntil time.Time
	Status Status 
} 