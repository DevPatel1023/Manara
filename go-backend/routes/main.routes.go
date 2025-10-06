package routes

import (
	"log"
	"github.com/gin-gonic/gin"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func SetupRoutes(router *gin.Engine, userController *controllers.UserController) {
	api := router.Group("/api/v1")

	// user routes
	RegisterUserRoutes(api, userController)

	// add a test rpute
	router.GET("/test",func(c *gin.Context){
		c.JSON(200,gin.H{"message":"api workss"})
	})
log.Println("✅ Routes registered: /api/v1/users and /api/v1/test")
}
