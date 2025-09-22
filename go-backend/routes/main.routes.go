package routes

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func SetupRoutes(router *gin.Engine) {

    // API v1 group
    api := router.Group("/api/v1")
    
    // Register user routes
    userController := &controllers.UserController{}
    
    log.Println("Calling RegisterUserRoutes...")
    RegisterUserRoutes(api, userController)

}