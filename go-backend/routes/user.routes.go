package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func RegisterUserRoutes(router *gin.RouterGroup, userController *controllers.UserController) {
    users := router.Group("/users")
    {
	users.GET("/all", userController.GetAllUsers)
	users.POST("/register", userController.CreateUser)
	users.GET("/:id", userController.GetUser)
	users.PUT("/:id", userController.UpdateUser)
}
}
