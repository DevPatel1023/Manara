package repository

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
)

type UserRepository interface {
	CreateNewUser(user *models.User) error
	GetUserByID(id uint) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	UpdateUserByID(user *models.User) error
}
