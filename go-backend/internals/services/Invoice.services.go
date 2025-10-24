package services

import (
	"errors"
	"time"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
)

type InvoiceService struct {
	repo repository.InvoiceRepository
}

func NewInvoiceService(repo repository.InvoiceRepository) *InvoiceService {
	return &InvoiceService{repo: repo}
}

func (s *InvoiceService) CreateNewInvoice(i *models.Invoice) error {
	if i.ProjectID == 0 || i.ClientID == 0 {
		return errors.New("projectID and clientID are required")
	}
	if i.Amount == 0 {
		return errors.New("amount cannot be 0")
	}

	i.IssuedDate = time.Now()
	if i.DueDate.IsZero() {
		i.DueDate = i.IssuedDate.AddDate(0, 0, 7) // Default 7 days payment period
	}
	i.InvoiceStatus = models.Unpaid

	return s.repo.CreateNewInvoice(i)
}

func (s *InvoiceService) GetInvoiceByID(id uint) (*models.Invoice, error) {
	return s.repo.GetInvoiceByID(id)
}

func (s *InvoiceService) GetAllInvoices() ([]models.Invoice, error) {
	return s.repo.GetAllInvoices()
}

func (s *InvoiceService) UpdateInvoice(id uint, i *models.Invoice) (*models.Invoice, error) {
	return s.repo.UpdateInvoice(i, id)
}

func (s *InvoiceService) DeleteInvoice(id uint) error {
	return s.repo.DeleteInvoice(id)
}

func (s *InvoiceService) GetInvoicesByClientID(clientID uint) ([]models.Invoice, error) {
	return s.repo.GetInvoicesByCustomerID(clientID)
}

func (s *InvoiceService) GetInvoicesByStatus(status string) ([]models.Invoice, error) {
	return s.repo.GetInvoicesByStatus(status)
}
