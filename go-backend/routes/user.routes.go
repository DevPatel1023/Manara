package routes

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func RegisterUserRoutes(rg *gin.RouterGroup, uc *controllers.UserController) {
    users := rg.Group("/users")
    {
        // Default GET route for /api/v1/users/root
        users.GET("/root", func(c *gin.Context) {
            log.Println("Users default GET route hit")
            c.JSON(200, gin.H{"message": "Users root working"})
        })

        users.POST("/register", uc.CreateUser)
        users.GET("/all", uc.GetAllUsers) // Note: changed to GetAllUsers (plural)
        users.GET("/:id", uc.GetUser)
        users.PUT("/:id", uc.UpdateUser)
        users.DELETE("/:id", uc.DeleteUser) // Added delete route
    }
}