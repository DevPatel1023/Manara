package models

import (
	"time"

	"gorm.io/gorm"
)

type ProjectStatus string

const (
	ProjectNotStarted ProjectStatus = "NOT_STARTED"
	ProjectInProgress ProjectStatus = "IN_PROGRESS"
	ProjectCompleted  ProjectStatus = "COMPLETED"
)

type Project struct {
	gorm.Model

	Name        string
	Description string
	ClientID    uint
	Client      User `gorm:"foreignKey:ClientID"`
	QuotationID uint
	Quotation   Quotation     `gorm:"foreignKey:QuotationID"`
	Pstatus     ProjectStatus `gorm:"type: varChar(20);default: 'ProjectNotStarted'"`
	StartDate   time.Time
	EndDate     time.Time
}
