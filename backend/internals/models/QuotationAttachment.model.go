package models

import (
	"time"

	"github.com/google/uuid"
)

type QuoteFileType string

const (
	QuotePDFFileType   QuoteFileType = "PDF"
	QuoteDOCFileType   QuoteFileType = "DOC"
	QuoteImageFileType QuoteFileType = "Image"
)

type QuotationAttachment struct {
	ID          uuid.UUID     `gorm:"primaryKey"`
	QuotationId uuid.UUID     `gorm:"type:uuid;not null"`
	Quotation   Quotation     `gorm:"foriegnKey:QuotationId"`
	FileName    string        `gorm:"type:string;default:file"`
	FileType    QuoteFileType `gorm:"default:'PDF'"`
	CreatedAt   time.Time
}
