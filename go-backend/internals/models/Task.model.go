package models

import (
	"gorm.io/gorm"
	"time"
)

type TaskStatus string

const (
	Todo TaskStatus = "TODO"
	InProgress TaskStatus = "INPROGRESS"
	Done TaskStatus = "DONE"
)

type Task struct {
	gorm.Model

	ProjectID uint
	Project Project `gorm:"foreignKey:ProjectID"`

	AssignedToEMPID uint
	AssignedTo User `gorm:"foreignKey:AssignedToEMPID"`

	Title string
	Description string
	Deadline time.Time
	Status TaskStatus
}