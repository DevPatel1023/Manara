package models

import (
	"time"

	"github.com/google/uuid"
)

// track internal review for a RFQ

type ReviewType string

const (
	PendingReviewType  ReviewType = "PENDING"
	InReviewReviewType ReviewType = "INREVIEW"
	ApprovedReviewType ReviewType = "APPROVED"
	RejectedReviewType ReviewType = "REJECTED"
)

type InternalReview struct {
	ID         uuid.UUID
	RFQID      uuid.UUID  `gorm:"type:uuid;not null"`
	RFQ        RFQ        `gorm:"foriegnKey:RFQID;"`
	ReviewedBy User       `gorm:"type:uuid;not null"`
	User       User       `gorm:"foriegnKey:ReviewedBy"`
	Status     ReviewType `gorm:"default:'PENDING';not null"`
	Comments   string     `gorm:"type:text"`
	ReviewedAt time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
