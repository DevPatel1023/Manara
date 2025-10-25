package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterInvoiceRoutes(router *gin.RouterGroup, ctrl *controllers.InvoiceController) {
	invoice := router.Group("/invoives")
	invoice.Use(middlewares.AuthMiddleware())

	admin := invoice.Group("/")
	admin.Use(middlewares.AuthorizeRole("admin"))
	{
		admin.POST("/create", ctrl.CreateInvoice)
		admin.GET("/all", ctrl.GetAllInvoices)
		admin.GET("/:id", ctrl.GetInvoiceByID)
		admin.PATCH("/:id", ctrl.UpdateInvoice)
		admin.DELETE("/:id", ctrl.DeleteInvoice)
	}
}
