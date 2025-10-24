package models

import (
	"time"

	"gorm.io/gorm"
)

type InvoiceStatus string

const (
	Paid    InvoiceStatus = "PAID"
	Unpaid  InvoiceStatus = "UNPAID"
	Overdue InvoiceStatus = "OVERDUE"
)

type Invoice struct {
	gorm.Model

	ProjectID     uint
	Project       Project `gorm:"foreignkey:ProjectID"`
	ClientID      uint
	Client        User `gorm:"foreignKey:ClientID"`
	Amount        uint
	InvoiceStatus InvoiceStatus `gorm:"type:varchar(20);default:'UNPAID'"`
	IssuedDate    time.Time
	DueDate       time.Time
}
