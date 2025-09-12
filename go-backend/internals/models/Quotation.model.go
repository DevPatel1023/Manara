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

	clientId uint //foreign key
	Client user.Client `gorm:"foreignKey:ClientID"`
	Title string
	Description string
	Estimated_cost uint
	Valid_until time.Time
	Status Status `gorm:"type:enum('APPROVED','REJECTED','PENDING');default:'PENDING'"`
} 