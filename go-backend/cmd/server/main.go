// cmd/server/main.go
package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/db"
	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/routes"
)

func main() {
	// Load env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// load db_url;
	DB_DSN := os.Getenv("DB_DSN")
	if DB_DSN == "" {
		log.Println("DB_DSN is empty, check .env file")
	}

	// connect db
	db.ConnectDB(DB_DSN)

	// Init Gin router
	router := gin.Default()

	// set trusted proxies
	err = router.SetTrustedProxies(nil)
	if err != nil {
		log.Fatal("failed to set trusted proxies", err)
	}

	// Register routes
	routes.SetupRoutes(router)

	// Run server
	log.Println("Server running on port", port)
	err = router.Run(":" + port)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
