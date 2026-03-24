package repository

import "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"

type QuotationRepository interface {
	CreateNewQuotation(model *models.Quotation) error
	GetAllQuotations() ([]models.Quotation, error)
	GetQuotationByID(id uint) (*models.Quotation, error)
	UpdateQuotation(model *models.Quotation) error
	UpdateQuotationStatus(id uint, status models.QuotationStatus) error
}
