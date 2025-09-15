// repositories/user_repository.go
package repositories

import (
	"gorm.io/gorm"
	"yourapp/models"
)

type UserRepository struct {
	DB *gorm.DB
}

// Create User
func (r *UserRepository) Create(user *models.User) error {
	return r.DB.Create(user).Error
}

// Find by ID
func (r *UserRepository) GetByID(id uint) (*models.User, error) {
	var user models.User
	err := r.DB.First(&user, id).Error
	return &user, err
}
