package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"gorm.io/gorm"
)

type InvoiceImplementation struct {
	DB *gorm.DB
}

func (r *InvoiceImplementation) CreateNewInvoice(p *models.Invoice) error {
	return r.DB.Create(p).Error
}

func (r *InvoiceImplementation) GetInvoiceByID(id uint) (*models.Invoice, error) {
	var invoice models.Invoice
	err := r.DB.Preload("Project").Preload("Client").First(&invoice, id).Error
	if err != nil {
		return nil, err
	}
	return &invoice, err
}

func (r *InvoiceImplementation) GetAllInvoices() ([]models.Invoice, error) {
	var invoices []models.Invoice
	err := r.DB.Preload("Project").Preload("Client").Find(&invoices).Error
	if err != nil {
		return nil, err
	}
	return invoices, err
}

func (r *InvoiceImplementation) UpdateInvoice(i *models.Invoice, id uint) (*models.Invoice, error) {
	err := r.DB.Model(&models.Invoice{}).Where("id = ?", id).Updates(i).Error
	if err != nil {
		return nil, err
	}
	return i, err
}

func (r *InvoiceImplementation) DeleteInvoice(id uint) error {
	return r.DB.Delete(&models.Invoice{}, id).Error
}

func (r *InvoiceImplementation) GetInvoicesByCustomerID(id uint) ([]models.Invoice, error) {
	var invoices []models.Invoice
	err := r.DB.Preload("Client").Where("ClientID = ?", id).Find(&invoices).Error
	if err != nil {
		return nil, err
	}
	return invoices, nil
}

func (r *InvoiceImplementation) GetInvoicesByStatus(status string) ([]models.Invoice, error) {
	var invoices []models.Invoice
	err := r.DB.Preload("Client").Preload("Project").Where("invoice_status = ?", status).Find(&invoices).Error
	return invoices, err
}
