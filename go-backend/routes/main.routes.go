package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func SetupRoutes(router *gin.Engine, userController *controllers.UserController) {
	api := router.Group("/api/v1")
	RegisterUserRoutes(api, userController)
}
