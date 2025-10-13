package services

import (
	"errors"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
)

type QuotationService struct {
	repo repository.QuotationRepository
}

func (s *QuotationService) CreateNewQuotation(quote models.Quotation) error {
	if quote.EstimatedCost == 0 || quote.EstimatedCost < 0 || quote.Status == "" {
		return errors.New("Data is invalid")
	}
	return s.repo.CreateNewQuotation(&quote)
}

func (s *QuotationService) GetAllQuotations() ([]models.Quotation, error) {
	return s.repo.GetAllQuotations()
}

func (s *QuotationService) GetQuotationByID(id uint) (*models.Quotation, error) {
	if id == 0 {
		return nil, errors.New("id invalid")
	}
	return s.repo.GetQuotationByID(id)
}

func (s *QuotationService) UpdateQuotation(quote *models.Quotation) error {
	if quote.ID == 0 {
		return errors.New("id invalid")
	}
	return s.repo.UpdateQuotation(quote)
}

func (s *QuotationService) UpdateQuotationStatus(id uint, status *models.QuotationStatus) error {
	if id == 0 || *status == "" {
		return errors.New("invalid  data")
	}
	return s.repo.UpdateQuotationStatus(id, *status)
}
