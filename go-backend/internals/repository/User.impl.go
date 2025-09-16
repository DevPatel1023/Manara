// repositories/user_repository.go
package repository

import (
	"gorm.io/gorm"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
)

type UserRepositoryImpl struct {
	DB *gorm.DB
}

// func : Create new User
func (r *UserRepository) CreateNewUser(user *models.User) error {
	return r.DB.Create(user).Error
}

// func : Find user by ID
func (r *UserRepository) GetUserByID(id uint) (*models.User, error) {
	var user models.User
	err := r.DB.First(&user, id).Error
	return &user, err
}

// func : get all users
func (r *UserRepository) GetAllUsers() ([]models.User , error ){ 
	var users []models.user
	err := r.DB.Find(&users).Error
	return users,err 
} 

// // func : update user with id
func (r *UserRepository) UpdateUserByID(user model.User) error {
	var data = request.UpdateUserRequest{
		Id : user.Id,
		Name : user.name,
		email : user.email,
		password : user.password
	}
	
   result := r.DB.Model(&user).updates(data)
   if result.Error != nil {
	return result.Error
   }

   return nil
}

