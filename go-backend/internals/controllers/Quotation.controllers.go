package controllers

import (
	"net/http"
	"strconv"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/services"
	"github.com/gin-gonic/gin"
)

type QuoteController struct {
	service *services.QuotationService
}

func NewQuotationController(s *services.QuotationService) *QuoteController {
	return &QuoteController{service: s}
}

func (ctrl *QuoteController) CreateNewQuotation(c *gin.Context) {
	var newQuote models.Quotation

	// bindJSON : to bind the recieved JSON data into newquote variable
	if err := c.BindJSON(&newQuote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// pass the new quote to the service
	if err := ctrl.service.CreateNewQuotation(newQuote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "Quotation created successfully",
		"quote":   newQuote,
	})
}

func (ctrl *QuoteController) GetAllQuotations(c *gin.Context) {
	var quotes []models.Quotation
	var err error

	quotes, err = ctrl.service.GetAllQuotations()

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "quotes fetched successfully",
		"Quotes":  quotes,
	})
}

func (ctrl *QuoteController) GetQuotationByID(c *gin.Context) {
	var quote *models.Quotation
	var err error

	id, _ := strconv.Atoi(c.Param("id"))

	quote, err = ctrl.service.GetQuotationByID(uint(id))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "quotes fetched successfully",
		"Quotes":  quote,
	})
}
