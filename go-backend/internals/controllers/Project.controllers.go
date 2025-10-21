package controllers

import (
	"net/http"
	"strconv"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/services"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/types"
	"github.com/gin-gonic/gin"
)

type ProjectController struct {
	s *services.ProjectService
}

func NewProjectController(s *services.ProjectService) *ProjectController {
	return &ProjectController{s: s}
}

func (ctrl *ProjectController) CreateNewProject(c *gin.Context) {
	var newProject models.Project

	// bindjson to newProject
	if err := c.BindJSON(&newProject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//pass new project to the service
	if err := ctrl.s.CreateNewProject(&newProject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "Project created successful",
		"project": newProject,
	})
}

func (ctrl *ProjectController) GetAllProjects(c *gin.Context) {
	var Projects []models.Project
	var err error

	//fetch all the projecta from the service
	Projects, err = ctrl.s.GetAllProjects()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Projects fetched successful",
		"projects": Projects,
	})
}

func (ctrl *ProjectController) GetProjectByID(c *gin.Context) {
	var Project *models.Project
	var err error

	id, _ := strconv.Atoi(c.Param("id"))

	//fetch all the projecta from the service
	Project, err = ctrl.s.GetProjectByID(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Project with given id fetched successful",
		"projects": Project,
	})
}

func (ctrl *ProjectController) UpdateProjectByID(c *gin.Context) {
	var Project *models.Project
	var err error

	// bind data from body
	if e := c.BindJSON(&Project); e != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": e.Error()})
		return
	}

	// get id from url
	id, _ := strconv.Atoi(c.Param("id"))

	// update project service
	Project, err = ctrl.s.UpdateProject(Project, uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully updated project",
		"project": Project})
}

func (ctrl *ProjectController) DeleteProjectByID(c *gin.Context) {
	// get id from url
	id, _ := strconv.Atoi(c.Param("id"))

	if err := ctrl.s.DeleteProjectByID(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "project deleted successfully"})
}

func (ctrl *ProjectController) FilterProjects(c *gin.Context) {
	var Projects []models.Project
	var err error
	var opts types.ProjectFilterOptions

	//get the filter options
	e := c.BindJSON(&opts)
	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": e.Error()})
		return
	}

	Projects, err = ctrl.s.FilterProjects(&opts)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":           "filtered projects",
		"Filtered projects": Projects,
	})
}
