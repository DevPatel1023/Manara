package models

import (
	"time"

	"github.com/google/uuid"
)

type FileType string

const (
	PDFFileType   FileType = "PDF"
	DOCFileType   FileType = "DOC"
	ImageFileType FileType = "Image"
)

type RFQAttachment struct {
	ID        uuid.UUID
	RFQId     RFQ
	File      FileType
	FileName  string
	FileUrl   string
	CreatedAt time.Time
}
