// internals/utils/auth.go
package utils

import (
    "time"
    "github.com/golang-jwt/jwt/v4"
    "golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("your_secret_key") // better keep in .env

// Hash password
func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}

// Check password
func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

// Generate JWT token
func GenerateJWT(userID uint) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "id":  userID,
        "exp": time.Now().Add(time.Hour * 24).Unix(), // expires in 24h
    })

    return token.SignedString(jwtSecret)
}
