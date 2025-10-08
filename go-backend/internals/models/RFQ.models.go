package models

import "gorm.io/gorm"

type RFQStatus string

const (
	Request  RFQStatus = "REQUEST"
	Reviewed RFQStatus = "REVIEWED"
)

type RFQ struct {
	gorm.Model
	ClientID    uint
	Client      User `gorm:"foreignKey:ClientID"`
	Title       string
	Description string
	Status      RFQStatus `gorm:"type:varChar(20);default:'Request'"`
}
