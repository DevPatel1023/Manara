package controllers

import (
	"net/http"
	"strconv"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/services"
	"github.com/gin-gonic/gin"
)

// RFQ controller
/*
1. CREATE RFQ : CLIENT
2. GETALL RFQS : ADMIN
3. GET RFQ BY ID : EMPLOYEE , ADMIN
4. UPDATE RFQ : CLIENT
5. UPDATE RFQ STATUS : ADMIN
5. DELETE RFQ :
*/

type RFQController struct {
	service *services.RFQService
}

func NewRFQController(s *services.RFQService) *RFQController {
	return &RFQController{service: s}
}

func (ctrl *RFQController) CreateNewRFQ(c *gin.Context) {
	var rfq models.RFQ
	if err := c.ShouldBindBodyWithJSON(&rfq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clientID, _ := c.Get("userID")
	rfq.ClientID = clientID.(uint)

	if err := ctrl.service.CreateNewRFQ(&rfq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "RFQ create successfully",
		"RFQ": rfq,
	})
}

func (ctrl *RFQController) GetAllRFQS(c *gin.Context) {
	var rfqs []models.RFQ
	var err error
	rfqs, err = ctrl.service.GetAllRFQS()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"message": "fetch all rfqs",
		"rfqs": rfqs})
}

func (ctrl *RFQController) GetRFQById(c *gin.Context) {
	var rfq *models.RFQ
	var err error
	id, _ := strconv.Atoi(c.Param("id"))

	rfq, err = ctrl.service.GetRFQById(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "RFQ not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "fetch the rfq successfully",
		"rfq":     rfq,
	})
}

func (ctrl *RFQController) UpdateRFQFields(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid RFQ ID"})
		return
	}

	var rfq models.RFQ
	if err := c.ShouldBindJSON(&rfq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	rfq.ID = uint(id)

	err = ctrl.service.UpdateRFQFields(&rfq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "RFQ updated successfully",
		"updatedRFQ": rfq,
	})
}

func (ctrl *RFQController) ReviewdRFQ(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var req struct {
		Status models.RFQStatus
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.service.ReviewdRFQ(uint(id), req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"message": "RFQ status updated",
		"Status": req.Status,
	})
}

func (ctrl *RFQController) DeleteRFQ(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := ctrl.service.DeleteRFQ(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "rfq deleted"})
}
