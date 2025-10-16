package services

import (
	"errors"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
)

type QuotationService struct {
	repo repository.QuotationRepository
}

func NewQuoteService(Repo repository.QuotationRepository) *QuotationService {
	return &QuotationService{repo: Repo}
}

func (s *QuotationService) CreateNewQuotation(quote models.Quotation) error {
	if quote.EstimatedCost == 0 || quote.QuoteStatus == "" {
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

func (s *QuotationService) UpdateQuotationStatus(id uint, status models.QuotationStatus, role string) error {
	var q *models.Quotation
	var err error

	if id == 0 || status == "" {
		return errors.New("invalid  data")
	}

	// fetch quotation
	q, err = s.repo.GetQuotationByID(id)
	if err != nil {
		return err
	}

	switch role {
	case "admin":
		if q.QuoteStatus != models.QuoteDraft {
			return errors.New("admin can only send draft quotation")
		}
		if status != models.QuoteSent {
			return errors.New("admin can only update status to 'sent'")
		}
	case "client":
		if q.QuoteStatus != models.QuoteSent {
			return errors.New("client can only send update quotation that are 'sent'")
		}
		if status != models.QuoteAccepted && status != models.QuoteRejected {
			return errors.New("client can only update status to 'accept' or 'reject'")
		}
	}

	return s.repo.UpdateQuotationStatus(id, status)
}
