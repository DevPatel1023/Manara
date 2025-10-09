package repository

import "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"

type RFQRepository interface {
	CreateNewRFQ(model *models.RFQ) error
	GetAllRFQS() ([]models.RFQ, error)
	GetRFQById(id uint) (*models.RFQ, error)
	UpdateRFQFields(model *models.RFQ) error
	ReviewdRFQ(model *models.RFQ) error
	DeleteRFQ(id uint) error
}
