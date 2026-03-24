package services

import (
	"errors"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
)

type RFQService struct {
	repo repository.RFQRepository
}

func NewRFQService(Repo repository.RFQRepository) *RFQService {
	return &RFQService{repo: Repo}
}

func (s *RFQService) CreateNewRFQ(rfq *models.RFQ) error {
	if rfq.Title == "" || rfq.Description == "" {
		return errors.New("Title and Description is required")
	}
	// make new rfq
	return s.repo.CreateNewRFQ(rfq)
}

func (s *RFQService) GetAllRFQS() ([]models.RFQ, error) {
	return s.repo.GetAllRFQS()
}

func (s *RFQService) GetRFQById(id uint) (*models.RFQ, error) {
	if id == 0 {
		return nil, errors.New("Invalid ID")
	}
	// return rfq by id
	return s.repo.GetRFQById(id)
}

func (s *RFQService) UpdateRFQFields(rfq *models.RFQ) error {
	if rfq.ID == 0 {
		return errors.New("Invalid id")
	}
	return s.repo.UpdateRFQFields(rfq)
}

func (s *RFQService) ReviewdRFQ(id uint, status models.RFQStatus) error {
	if id == 0 || status == "" {
		return errors.New("Required valid id and status")
	}
	return s.repo.ReviewdRFQ(id, status)
}

func (s *RFQService) DeleteRFQ(id uint) error {
	if id == 0 {
		return errors.New("Invalid id")
	}
	return s.repo.DeleteRFQ(id)
}
