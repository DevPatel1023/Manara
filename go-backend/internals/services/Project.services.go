package services

import (
	"errors"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/types"
)

type ProjectService struct {
	repo repository.ProjectRepository
}

func NewProjectService(repo repository.ProjectRepository) *ProjectService {
	return &ProjectService{repo: repo}
}

func (s *ProjectService) CreateNewProject(project *models.Project) error {

	if project.Name == "" || project.ClientID == 0 || project.Description == "" || project.QuotationID == 0 || project.Pstatus == "" {
		return errors.New("project fields are required")
	}

	return s.repo.CreateNewProject(project)
}

func (s *ProjectService) GetAllProjects() ([]models.Project, error) {
	return s.repo.GetAllProject()
}

func (s *ProjectService) GetProjectByID(id uint) (*models.Project, error) {
	if id == 0 {
		return nil, errors.New("Id is invalid")
	}
	return s.repo.GetProjectByID(id)
}

func (s *ProjectService) UpdateProject(p *models.Project, id uint) (*models.Project, error) {

	if id == 0 || p.Name == "" || p.Description == "" || p.Pstatus == "" {
		return nil, errors.New("project fields (name, description, status) are required")
	}
	return s.repo.UpdateProject(p, id)
}

func (s *ProjectService) DeleteProjectByID(id uint) error {
	if id == 0 {
		return errors.New("Id is invalid")
	}
	return s.repo.DeleteProjectByID(id)
}

func (s *ProjectService) FilterProjects(opts *types.ProjectFilterOptions) ([]models.Project, error) {
	return s.repo.FilterProjects(opts)
}
