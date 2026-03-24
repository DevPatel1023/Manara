package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"gorm.io/gorm"
)

type QuotationImplementation struct {
	DB *gorm.DB
}

func NewQuoteRepository(db *gorm.DB) QuotationRepository {
	return &QuotationImplementation{DB: db}
}

func (r *QuotationImplementation) CreateNewQuotation(quote *models.Quotation) error {
	return r.DB.Preload("RFQ").Create(quote).Error
}

func (r *QuotationImplementation) GetAllQuotations() ([]models.Quotation, error) {
	var quotations []models.Quotation
	err := r.DB.Preload("RFQ.Client").Preload("RFQ").Find(&quotations).Error
	return quotations, err
}

func (r *QuotationImplementation) GetQuotationByID(id uint) (*models.Quotation, error) {
	var quotation models.Quotation
	err := r.DB.Preload("RFQ.Client").Preload("RFQ").Where("id = ?", id).First(&quotation, id).Error
	if err != nil {
		return nil, err
	}
	return &quotation, nil
}

func (r *QuotationImplementation) UpdateQuotation(model *models.Quotation) error {
	return r.DB.Model(&models.Quotation{}).
		Where("id = ?", model.ID).Updates(map[string]interface{}{
		"estimated_cost": model.EstimatedCost,
		"remarks":        model.Remarks,
	}).Error

}

func (r *QuotationImplementation) UpdateQuotationStatus(id uint, status models.QuotationStatus) error {
	return r.DB.Model(&models.Quotation{}).
		Where("id = ?", id).
		Update("quote_status", status).Error
}
