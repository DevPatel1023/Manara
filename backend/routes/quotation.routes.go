package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterQuoteRoutes(router *gin.RouterGroup, quoteController *controllers.QuoteController) {
	quote := router.Group("/quotes")
	quote.Use(middlewares.AuthMiddleware())

	// Employee: Create & Update before admin approval
	emp := quote.Group("/")
	emp.Use(middlewares.AuthorizeRole("employee"))
	{
		emp.POST("/create", quoteController.CreateNewQuotation)   // default status: draft
		emp.PATCH("/update/:id", quoteController.UpdateQuotation) // editable while draft
	}

	// Admin: Review & Send to Client
	admin := quote.Group("/")
	admin.Use(middlewares.AuthorizeRole("admin"))
	{
		admin.GET("/all", quoteController.GetAllQuotations)
	}

	// Client,Admin : Status update of Quotation
	status := quote.Group("/")
	status.Use(middlewares.AuthorizeRole("admin", "client"))
	{
		status.PATCH("/:id/status", quoteController.UpdateQuotationStatus)
		//client : sent -> accepted/rejected
		//admin : draft -> sent
	}

	// Admin & Employee: View quotation details
	view := quote.Group("/")
	view.Use(middlewares.AuthorizeRole("admin", "employee"))
	{
		view.GET("/:id", quoteController.GetQuotationByID)
	}
}
