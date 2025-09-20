package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func SetupRoutes(router *gin.Engine) {
    // Root route (this works at http://localhost:8080/)
    router.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Server is running"})
    })

    // Ping route for health check
    router.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })

    // API v1 group
    api := router.Group("/api/v1")
    {
        // Root API test (this works at http://localhost:8080/api/v1/root)
        api.GET("/root", func(c *gin.Context) {
            c.JSON(200, gin.H{"message": "API v1 root working"})
        })

        // Register user routes
        userController := &controllers.UserController{}
        RegisterUserRoutes(api, userController)
    }
}