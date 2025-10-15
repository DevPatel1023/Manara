// services/user_service.go
package services

import (
	"errors"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
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

	// check if email id is already exist
	existingUser, err := s.Repo.GetUserByEmail(user.Email)
	if existingUser != nil {
		return errors.New("Email already registered")
	}

	// hash the password before saving in db
	hashed, err := utils.HashPassword(user.Password)

	if err != nil {
		return err
	}

	user.Password = hashed

	// create user through db actions of repository
	return s.Repo.CreateNewUser(user)
}

func (s *UserService) LoginUser(email string, password string) (string, error) {

	//  Email & password is required
	if email == "" || password == "" {
		return "", errors.New("Email and password are required")
	}

	// Get the user from repo
	user, err := s.Repo.GetUserByEmail(email)

	// check err
	if err != nil {
		return "", errors.New("Invalid email")
	}

	// compare password
	if !utils.CheckPasswordHash(password, user.Password) {
		return "", errors.New("Invalid password")
	}

	// generate jwt token
	token, err := utils.GenerateJWT(user.ID, user.Name, user.Email, string(user.Role))

	if err != nil {
		return "", errors.New("Error : Jwt generate error")
	}

	return token, nil
}

func (s *UserService) GetUserByID(id uint) (*models.User, error) {
	if id == 0 {
		return nil, errors.New("User Id is required")
	}
	return s.Repo.GetUserByID(id)
}

func (s *UserService) GetAllUsers() ([]models.User, error) {
	return s.Repo.GetAllUsers()
}

func (s *UserService) UpdateUserByID(id uint, updates map[string]interface{}, currentRole string) error {
	if id == 0 {
		return errors.New("id is required")
	}
	//user can't modify the role directly :: only admin can

	// fetch existing user using repository
	existingUser, err := s.Repo.GetUserByID(id)
	if err != nil {
		return err
	}

	// Non-admins cannot change role
	if currentRole != string(models.Admin) {
		delete(updates, "role")
	}

	// Ensure role remains same if not explicitly updated by admin
	if _, ok := updates["role"]; !ok {
		updates["role"] = existingUser.Role
	}

	return s.Repo.UpdateUserByID(id, updates)
}

func (s *UserService) DeleteUser(id uint) error {
	return s.Repo.Delete(id)
}
