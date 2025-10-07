package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.RouterGroup, userController *controllers.UserController) {
	users := router.Group("/users")
	{
		// Public routes
		users.POST("/register", userController.CreateUser)
		users.POST("/login", userController.LoginUser)

		// Protected routes
		protected := users.Group("/")
		protected.Use(middlewares.AuthMiddleware())

		// Admin-only routes
		admin := protected.Group("/")
		admin.Use(middlewares.AuthorizeRole("admin"))
		admin.GET("/all", userController.GetAllUsers)

		// Employee or Admin routes
		employee := protected.Group("/")
		employee.Use(middlewares.AuthorizeRole("employee", "admin"))
		employee.GET("/:id", userController.GetUser)
	}
}
