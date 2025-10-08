package repository

import "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"

type RFQRepository interface {
	CreateNewRFQ(model *models.RFQ) error
	GetAllRFQS() ([]models.RFQ, error)
	ReviewdRFQ(model *models.RFQ) error
}
