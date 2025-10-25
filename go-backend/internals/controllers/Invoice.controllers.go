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

	c.JSON(http.StatusCreated, gin.H{
		"message": "Invoice created successfully",
		"invoice": invoice,
	})
}

func (ctrl *InvoiceController) GetInvoiceByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	invoice, err := ctrl.service.GetInvoiceByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoice": invoice})
}

func (ctrl *InvoiceController) GetAllInvoices(c *gin.Context) {
	invoices, err := ctrl.service.GetAllInvoices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoices": invoices})
}

func (ctrl *InvoiceController) UpdateInvoice(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedInvoice, err := ctrl.service.UpdateInvoice(uint(id), &invoice)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Invoice updated successfully",
		"invoice": updatedInvoice,
	})
}

func (ctrl *InvoiceController) DeleteInvoice(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	if err := ctrl.service.DeleteInvoice(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted successfully"})
}

func (ctrl *InvoiceController) GetInvoicesByClientID(c *gin.Context) {
	clientID, err := strconv.Atoi(c.Param("clientID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	invoices, err := ctrl.service.GetInvoicesByClientID(uint(clientID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoices": invoices})
}

func (ctrl *InvoiceController) GetInvoicesByStatus(c *gin.Context) {
	status := c.Param("status")
	if status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status parameter required"})
		return
	}

	invoices, err := ctrl.service.GetInvoicesByStatus(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoices": invoices})
}
