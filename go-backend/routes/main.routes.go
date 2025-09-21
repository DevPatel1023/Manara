package routes

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func SetupRoutes(router *gin.Engine) {
    log.Println("Setting up routes...")
    
    router.GET("/", func(c *gin.Context) {
        log.Println("Root route hit")
        c.JSON(200, gin.H{"message": "Server is running"})
    })

    // Ping route for health check
    router.GET("/ping", func(c *gin.Context) {
        log.Println("Ping route hit")
        c.JSON(200, gin.H{"message": "pong"})
    })

    log.Println("Creating API v1 group...")
    // API v1 group
    api := router.Group("/api/v1")
    
    log.Println("Adding /api/v1/root route...")
    // Root API test
    api.GET("/root", func(c *gin.Context) {
        log.Println("API v1 root route hit")
        c.JSON(200, gin.H{"message": "API v1 root working"})
    })

    log.Println("Creating UserController...")
    // Register user routes
    userController := &controllers.UserController{}
    
    log.Println("Calling RegisterUserRoutes...")
    RegisterUserRoutes(api, userController)
    
    log.Println("Routes setup completed!")
}