package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/types"
)

type ProjectRepository interface {
	createNewProject(p *models.Project) error
	GetProjectByID(id uint) (*models.Project, error)
	GetAllProject() ([]models.Project, error)
	UpdateProject(p *models.Project) error
	DeleteProjectByID(id uint) error
	FilterProjects(opts *types.ProjectFilterOptions) ([]models.Project, error)
}
