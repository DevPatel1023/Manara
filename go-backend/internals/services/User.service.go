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
	//  Email & password is required
	if user.Email == "" || user.Password == "" {
		return errors.New("email and password are required")
	}

	// hash the password before saving in db
	hashed,err := utils.HashPassword(user.Password)

	if err != nil {
		return err
	}

	user.password = hashed

	// create user through db actions of repository
	return s.Repo.CreateNewUser(user) 
}

func (s *UserService) LoginUser(user *models.User) error{
	
	//  Email & password is required
	if user.Email == "" || user.Password == "" {
		return errors.New("Email and password are required")
	}

	// Get the user from repo
	user,err := s.Repo.GetUserByEmail(email)

	// check err
	if err != nil {
		return errors.New("Invalid email")
	}

	// compare password
	if !utils.CheckPasswordHash(password,user.password) {
		return errors.New("Invalid password")
	}

	// generate jwt token
	token , err := utils.GenerateJWT(user.ID,user.Email)

	if err != nil {
		return errors.New("Error : Jwt generate error")
	}

	return token,nil
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