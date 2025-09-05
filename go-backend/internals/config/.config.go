package config

import (
	"log"
	"os"
)

type Config struct {
	DB_DSN string
}

func LoadConfig() *Config {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("DB_DSN not set")
	}
	return &Config{
		DB_DSN: dsn,
	}
}
