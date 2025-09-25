// services/user_service.go
package services

import (
	"errors"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/utils"
)

type UserService struct {
	Repo repository.UserRepository
}


func NewUserService(repo repository.UserRepository) *UserService {
    return &UserService{Repo: repo}
}

func (s *UserService) RegisterUser(user *models.User) error {
	//  Email is required
	if user.Email == "" | user.password == "" {
		return errors.New("email and password is required")
	}

	// hash the password before saving in db
	hashed,err := utils.HashPassword(user.password)

	if err != nil {
		return err
	}

	user.password = hashed

	// create user through db actions of repository
	return s.Repo.CreateNewUser(user) 
}

fun (s *UserService) LoginUser(email,password string) (string,error){
	users,err := s.Repo.GetAllUsers()

	if
}

func(s *UserService) GetUserByID(id uint) (*models.User,error) {
	if id == 0 {
		return nil , errors.New("User Id is required")
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