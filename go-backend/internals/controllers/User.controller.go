package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/services"
)

type UserController struct {
	service *services.UserService
}

func NewUserController(s *services.UserService) *UserController {
	return &UserController{service : s}
}

func (ctrl *UserController) CreateUser(c *gin.Context){
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest , gin.H{"error" : err.Error()})
		return
	}

	if err := ctrl.service.RegisterUser(&user);err != nil {
		c.JSON(http.StatusInternalServerError , gin.H{"error" : err.Error()})
		return
	}
}

func (ctrl *UserController) GetUser(c *gin.Context) {
	idParam := c.Param("id")
	id, _ := strconv.Atoi(idParam)
	user, err := ctrl.service.GetUserByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (ctrl *UserController) GetAllUsers(c *gin.Context) {
	users, err := ctrl.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (ctrl *UserController) UpdateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.service.UpdateUserByID(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}