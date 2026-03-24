package routes

import (
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterProjectRoutes(router *gin.RouterGroup, projectController *controllers.ProjectController) {
	project := router.Group("/projects")
	project.Use(middlewares.AuthMiddleware())

	//admin creates projects
	admin := project.Group("/")
	admin.Use(middlewares.AuthorizeRole("admin"))
	{
		// Admin-only routes: create, update, list, delete, and filter projects

		admin.POST("/create", projectController.CreateNewProject)
		admin.PATCH("/update/:id", projectController.UpdateProjectByID)
		admin.GET("/all", projectController.GetAllProjects)
		admin.DELETE("/delete/:id", projectController.DeleteProjectByID)
		admin.POST("/filter", projectController.FilterProjects)
	}

	// admin and emp : get project by id
	view := project.Group("/")
	view.Use(middlewares.AuthorizeRole("admin", "employee"))
	{
		view.GET("/:id", projectController.GetProjectByID)
	}
}
