package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterRFQRoutes(router *gin.RouterGroup, rfqController *controllers.RFQController) {
	rfq := router.Group("/rfq")

	// Client: create RFQ
	client := rfq.Group("/")
	client.Use(middlewares.AuthorizeRole("Client"))
	client.POST("/", rfqController.CreateNewRFQ)

	// Admin + Employee: view & review
	admin := rfq.Group("/")
	admin.Use(middlewares.AuthorizeRole("Admin", "Employee"))
	admin.GET("/", rfqController.GetAllRFQS)
	admin.GET("/:id", rfqController.GetRFQById)
	admin.PATCH("/:id/status", rfqController.ReviewdRFQ)

	// Admin only: delete RFQ
	super := rfq.Group("/")
	super.Use(middlewares.AuthorizeRole("Admin"))
	super.DELETE("/:id", rfqController.DeleteRFQ)
}
