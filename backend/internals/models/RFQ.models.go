package models

import "gorm.io/gorm"

type RFQStatus string

const (
	RFQRequest   RFQStatus = "REQUEST"
	RFQReviewed  RFQStatus = "REVIEWED"
	RFQRejected  RFQStatus = "REJECTED"
	RFQConverted RFQStatus = "CONVERTED"
)

type RFQ struct {
	gorm.Model
	ClientID       uint
	Client         User `gorm:"foreignKey:ClientID"`
	Title          string
	Description    string
	Status         RFQStatus `gorm:"type:varChar(20);default:'RFQRequest'"`
	BudgetEstimate uint
}
