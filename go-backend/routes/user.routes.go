package routes 

import (
	"github.com/gin-gonic/gin"
 "github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
)
func RegisterUserRoutes(rg *gin.RouterGroup, userController *controllers.UserController) {
    users := rg.Group("/users")


	// Default GET route for /api/v1/users
    users.GET("/", func(c *gin.Context) {
        log.Println("Users default GET route hit")
        c.JSON(200, gin.H{"message": "Users root working"})
    })

    users.POST("/register", userController.CreateUser)
    users.GET("/:id", userController.GetUser)
    users.GET("/", userController.GetAllUser)
    users.PUT("/:id", userController.UpdateUser)
}
