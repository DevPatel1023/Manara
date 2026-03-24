package models

import (
	"time"

	"gorm.io/gorm"
)

type TaskStatus string
type TaskPriority string

const (
	Low    TaskPriority = "LOW"
	Medium TaskPriority = "MEDIUM"
	High   TaskPriority = "HIGH"
)

const (
	Todo       TaskStatus = "TODO"
	InProgress TaskStatus = "INPROGRESS"
	Done       TaskStatus = "DONE"
)

type Task struct {
	gorm.Model

	ProjectID uint
	Project   Project `gorm:"foreignKey:ProjectID"`

	AssignedToEMPID uint
	AssignedTo      User `gorm:"foreignKey:AssignedToEMPID"`

	Title       string
	Description string
	Priority    TaskPriority
	Deadline    time.Time
	Status      TaskStatus
}
