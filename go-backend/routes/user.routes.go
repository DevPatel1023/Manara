package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.RouterGroup, userController *controllers.UserController) {
	users := router.Group("/users")

	// public routes
	users.POST("/register", userController.CreateUser)
	users.POST("/login", userController.LoginUser)

	// protected routes
	users.Use(middlewares.AuthMiddleware())
	{
		users.GET("/all", userController.GetAllUsers)
		users.GET("/:id", userController.GetUser)
		users.PATCH("/:id", userController.UpdateUser)
		users.DELETE("/:id", userController.DeleteUser)
	}
}
