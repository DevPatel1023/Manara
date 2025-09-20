package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func SetupRoutes(router *gin.Engine) {
    api := router.Group("/api/v1")

	// Default test route for /api/v1
    api.GET("/", func(c *gin.Context) {
        log.Println("Default GET route hit")
        c.JSON(200, gin.H{"message": "API v1 root working"})
    })


    userController := &controllers.UserController{}
    RegisterUserRoutes(api, userController) // call function in same package
}
