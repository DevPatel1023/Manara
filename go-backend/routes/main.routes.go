package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, userController *controllers.UserController, rfqController *controllers.RFQController) {
	api := router.Group("/api/v1")

	// user routes
	RegisterUserRoutes(api, userController)
	RegisterRFQRoutes(api, rfqController)
}
