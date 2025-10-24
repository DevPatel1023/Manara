package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
)

type InvoiceRepository interface {
	CreateNewInvoice(i *models.Invoice) error
	GetInvoiceByID(id uint) (*models.Invoice, error)
	GetAllInvoices() ([]models.Invoice, error)
	UpdateInvoice(i *models.Invoice, id uint) (*models.Invoice, error)
	DeleteInvoice(id uint) error
	GetInvoicesByCustomerID(customerID uint) ([]models.Invoice, error)
	GetInvoicesByStatus(status string) ([]models.Invoice, error)
}
