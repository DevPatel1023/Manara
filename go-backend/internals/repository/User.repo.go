package repository

import (
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateNewUser(user *models.User , error)
	GetUserByID(UserId uint) (user *models.User,err error)
	GetAllUsers() ([]models.User , error)
	UpdateUserByID(user *models.User) error
}