package repository

import (
	"gorm.io/gorm"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
)

type UserRepositoryImpl struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
    return &UserRepositoryImpl{DB: db}
}


// Create new user
func (r *UserRepositoryImpl) CreateNewUser(user *models.User) error {
	return r.DB.Create(user).Error
}

// Get user by ID
func (r *UserRepositoryImpl) GetUserByID(id uint) (*models.User, error) {
	var user models.User
	err := r.DB.First(&user, id).Error
	return &user, err
}

// Get all users
func (r *UserRepositoryImpl) GetAllUsers() ([]models.User, error) {
	var users []models.User
	err := r.DB.Find(&users).Error
	return users, err
}

// Update user by ID
func (r *UserRepositoryImpl) UpdateUserByID(user *models.User) error {
	return r.DB.Model(&models.User{}).Where("id = ?", user.ID).Updates(user).Error
}
