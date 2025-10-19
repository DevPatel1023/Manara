package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/types"
	"gorm.io/gorm"
)

type ProjectImplementation struct {
	DB *gorm.DB
}

// func NewProjectRepository(db *gorm.DB) ProjectRepository {
// 	return &ProjectImplementation{DB: db}
// }

func (r *ProjectImplementation) CreateNewProject(p *models.Project) error {
	return r.DB.Create(p).Error
}

func (r *ProjectImplementation) GetProjectByID(id uint) (*models.Project, error) {
	var project models.Project
	err := r.DB.Preload("Client").Preload("Quotation").First(&project, id).Error
	if err != nil {
		return nil, err
	}
	return &project, err
}

func (r *ProjectImplementation) GetAllProjects() ([]models.Project, error) {
	var projects []models.Project
	err := r.DB.Preload("Client").Preload("Quotation").Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, err
}

func (r *ProjectImplementation) UpdateProject(p *models.Project, id uint) (*models.Project, error) {
	err := r.DB.Model(&models.Project{}).Where("id = ?", id).Updates(p).Error
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *ProjectImplementation) DeleteProjectByID(id uint) error {
	return r.DB.Delete(&models.Project{}, id).Error
}

func (r *ProjectImplementation) FilterProjects(opts *types.ProjectFilterOptions) ([]models.Project, error) {
	var projects []models.Project
	query := r.DB.Model(&models.Project{})

	if opts.ClientID != 0 {
		query = query.Where("client_id = ?", opts.ClientID)
	}
	if opts.Status != "" {
		query = query.Where("pstatus = ?", opts.Status)
	}

	err := query.Preload("Client").Preload("Quotation").Find(&projects).Error
	return projects, err
}
