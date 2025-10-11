package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterRFQRoutes(router *gin.RouterGroup, rfqController *controllers.RFQController) {
	rfq := router.Group("/rfqs")
	rfq.Use(middlewares.AuthMiddleware())
	{
		// Client: create RFQ
		client := rfq.Group("/")
		client.Use(middlewares.AuthorizeRole("client"))
		client.POST("/create", rfqController.CreateNewRFQ)
		client.PATCH("/updaterfqfield", rfqController.UpdateRFQFields)

		// Admin + Employee: view & review
		admin := rfq.Group("/")
		admin.Use(middlewares.AuthorizeRole("admin", "employee"))
		admin.GET("/all", rfqController.GetAllRFQS)
		admin.GET("/:id", rfqController.GetRFQById)
		admin.PATCH("/:id/status", rfqController.ReviewdRFQ)

		// Admin only: delete RFQ
		super := rfq.Group("/")
		super.Use(middlewares.AuthorizeRole("admin"))
		super.DELETE("/:id", rfqController.DeleteRFQ)
	}
}
