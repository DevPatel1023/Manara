package controllers

import (
	"net/http"
	"strconv"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/services"
	"github.com/gin-gonic/gin"
)

type InvoiceController struct {
	service *services.InvoiceService
}

func NewInvoiceController(service *services.InvoiceService) *InvoiceController {
	return &InvoiceController{service: service}
}

func (ctrl *InvoiceController) CreateInvoice(c *gin.Context) {
	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.service.CreateNewInvoice(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Invoice created successfully", "invoice": invoice})
}

func (ctrl *InvoiceController) GetInvoice(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	invoice, err := ctrl.service.GetInvoiceByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, invoice)
}
