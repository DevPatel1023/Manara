package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/controllers"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/db"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/repository"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/services"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/routes"
)

func main() {
	// Load .env
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	DB_DSN := os.Getenv("DB_DSN")
	if DB_DSN == "" {
		log.Println("DB_DSN is empty, check .env file")
	}

	// Connect to DB
	database := db.ConnectDB(DB_DSN)

	// Initialize layers
	// 1.user layers
	userRepo := repository.NewUserRepository(database)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	// 2.rfq layers
	rfqRepo := repository.NewRFQRepository(database)
	rfqService := services.NewRFQService(rfqRepo)
	rfqController := controllers.NewRFQController(rfqService)

	// 2.rfq layers
	quoteRepo := repository.NewQuoteRepository(database)
	quoteService := services.NewQuoteService(quoteRepo)
	quoteController := controllers.NewQuotationController(quoteService)

	// Init Gin
	router := gin.Default()
	err = router.SetTrustedProxies(nil)
	if err != nil {
		log.Fatal("Failed to set trusted proxies:", err)
	}

	// Setup routes
	routes.SetupRoutes(router, userController, rfqController, quoteController)

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// Start server
	log.Println("Server running on port", port)
	err = router.Run(":" + port)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
