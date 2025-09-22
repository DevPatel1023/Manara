package routes

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)

func RegisterUserRoutes(rg *gin.RouterGroup, uc *controllers.UserController) {
    log.Println("RegisterUserRoutes function called")
    users := rg.Group("/users")
    { 

        users.POST("/register", uc.CreateUser)
        users.GET("/all", uc.GetAllUsers) // Note: changed to GetAllUsers (plural)
        users.GET("/:id", uc.GetUser)
        users.PUT("/:id", uc.UpdateUser)

    }
}