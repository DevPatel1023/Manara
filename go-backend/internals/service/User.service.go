// services/user_service.go
package services

import (
	"errors"
	"yourapp/models"
	"yourapp/repositories"
)

type UserService struct {
	Repo *repositories.UserRepository
}

func (s *UserService) RegisterUser(user *models.User) error {
	// Rule: Email is required
	if user.Email == nil {
		return errors.New("email is required")
	}
	return s.Repo.Create(user) // delegate DB action to repo
}
