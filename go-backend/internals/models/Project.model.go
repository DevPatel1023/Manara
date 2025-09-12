package models

import (
	"gorm.io/gorm"
	"time"
)

type Project struct {
	gorm.Model

	QuotationID uint
	Quotation Quotation `gorm:"foreignKey:QuotationID"`
	Name string
	Description string
	StartDate time.Time
	EndDate time.Time
}