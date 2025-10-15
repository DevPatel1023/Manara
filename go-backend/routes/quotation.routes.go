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
		admin.PATCH("/:id/status", quoteController.UpdateQuotationStatus) // draft -> sent
	}

	// Client: Accept / Reject Quotation
	client := quote.Group("/")
	client.Use(middlewares.AuthorizeRole("client"))
	{
		client.PATCH("/:id/status", quoteController.UpdateQuotationStatus) // sent -> accepted/rejected
	}

	// Admin & Employee: View quotation details
	view := quote.Group("/")
	view.Use(middlewares.AuthorizeRole("admin", "employee"))
	{
		view.GET("/:id", quoteController.GetQuotationByID)
	}
}
