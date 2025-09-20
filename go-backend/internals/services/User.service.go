// services/user_service.go
package services

import (
	"errors"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
)

type UserService struct {
	Repo repository.UserRepository
}

func (s *UserService) RegisterUser(user *models.User) error {
	//  Email is required
	if user.Email == nil {
		return errors.New("email is required")
	}

	// Password is required
	if user.Password == "" {
		return errors.New("password is required")
	}

	// create user through db actions of repository
	return s.Repo.CreateNewUser(user) 
}

func(s *UserService) GetUserByID(id uint) (*models.User,error) {
	if id == 0 {
		return errors.New("User Id is required")
	}
	return s.Repo.GetUserByID(id)
}


func(s *UserService) GetAllUsers() ([]models.User,error) {
	return s.Repo.GetAllUsers()
}

func(s *UserService) UpdateUserByID(user *models.User) error {
	if user.ID == 0 {
		return errors.New("id is required")
	}
	return s.Repo.UpdateUserByID(user)
}