package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models"
)

var DB *gorm.DB

// ConnectDB connects to Postgres with given DSN and migrates models
func ConnectDB(dsn string) {
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Assign to global variable
	DB = database

	// AutoMigrate all models
	err = DB.AutoMigrate(
		&models.User{},
		&models.Quotation{},
		&models.Invoice{},
		&models.Project{},
		&models.Task{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	log.Println(" Database connected and migrated successfully")
}
