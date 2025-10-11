// internals/utils/auth.go
package utils

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type SignedDetails struct {
	UserID uint
	Name   string
	Email  string
}

// Generate JWT token
func GenerateJWT(userID uint, name string, email string, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub":      userID,
			"username": name,
			"email":    email,
			"role":     role,
			"exp":      time.Now().Add(time.Hour * 24).Unix(),
		})

	tokenString, err := token.SignedString(jwtSecret)
	fmt.Println("jwt token", tokenString)
	if err != nil {
		return "", err
	}
	fmt.Println("jwt token", tokenString)
	return tokenString, nil
}

func ParseJWT(tokenString string) (jwt.MapClaims, error) {
	if tokenString == "" {
		return nil, errors.New("empty token")
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		println(claims)
		return claims, nil
	}
	return nil, errors.New("Unable to parse claims")
}

// get user details by token string
func ParseTokenToUser(tokenStr string) (userID uint, email string, role string, err error) {
	claims, err := ParseJWT(tokenStr)
	println(claims, err)
	if err != nil {
		return 0, "", "", err
	}
	if sub, ok := claims["sub"].(float64); ok {
		userID = uint(sub)
	} else if subStr, ok := claims["sub"].(string); ok {
		var parsed uint64
		parsed, err = strconv.ParseUint(subStr, 10, 64)
		if err == nil {
			userID = uint(parsed)
		}
	}
	if e, ok := claims["email"].(string); ok {
		email = e
	}
	if r, ok := claims["role"].(string); ok {
		role = r
	}
	return userID, email, role, nil
}
