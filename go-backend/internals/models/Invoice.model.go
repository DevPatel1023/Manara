package models

import (
	"gorm.io/gorm"
	"time"
)

type InvoiceStatus string

const (
	Paid InvoiceStatus = "Paid",
	Unpaid InvoiceStatus = "Unpaid"
)

type Invoice struct {
	gorm.Model

	ProjectID uint
	Project Project `gorm:"foreignkey:ProjectId"`
	Amount uint
	status InvoiceStatus
	IssuedDate time.Time
}