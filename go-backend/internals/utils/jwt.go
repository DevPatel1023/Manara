// internals/utils/auth.go
package utils

import (
	"fmt"
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("JWT_SECRET")

// Generate JWT token
func GenerateJWT(name string , email string) (string,error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
	jwt.MapClaims{
		"username" : name, 
		"email" : email ,
		"exp" : time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString , err := token.SignedString(jwtSecret)

	if err != nil {
		return "",err
	}
	return tokenString,nil
}