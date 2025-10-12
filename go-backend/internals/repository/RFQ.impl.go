package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"gorm.io/gorm"
)

type RFQImplementation struct {
	DB *gorm.DB
}

func NewRFQRepository(db *gorm.DB) RFQRepository {
	return &RFQImplementation{DB: db}
}

func (r *RFQImplementation) CreateNewRFQ(rfq *models.RFQ) error {
	return r.DB.Create(rfq).Error
}

func (r *RFQImplementation) GetAllRFQS() ([]models.RFQ, error) {
	var rfqs []models.RFQ
	err := r.DB.Preload("Client", func(db *gorm.DB) *gorm.DB {
		return db.Omit("password")
	}).Find(&rfqs).Error
	return rfqs, err
}

func (r *RFQImplementation) GetRFQById(id uint) (*models.RFQ, error) {
	var rfq models.RFQ
	err := r.DB.Preload("Client").First(&rfq, id).Error
	return &rfq, err
}

func (r *RFQImplementation) UpdateRFQFields(rfq *models.RFQ) error {
	return r.DB.Where("id = ?", rfq.ID).Updates(rfq).Error
}

func (r *RFQImplementation) ReviewdRFQ(id uint, status models.RFQStatus) error {
	return r.DB.Model(&models.RFQ{}).Where("id = ?", id).Update("Status", status).Error
}

func (r *RFQImplementation) DeleteRFQ(id uint) error {
	return r.DB.Model(&models.RFQ{}).Delete("id = ?", id).Error
}
