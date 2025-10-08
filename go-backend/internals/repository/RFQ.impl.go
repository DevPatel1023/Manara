package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"gorm.io/gorm"
)

type RFQImplementation struct {
	DB *gorm.DB
}

func (r *RFQImplementation) CreateNewRFQ(rfq *models.RFQ) error {
	return r.DB.Create(rfq).Error
}

func (r *RFQImplementation) GetAllRFQS() ([]models.RFQ, error) {
	var rfqs []models.RFQ
	err := r.DB.Preload("client").Find(&rfqs).Error
	return rfqs, err
}
