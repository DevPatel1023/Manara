package middlewares

import (
	"strings"

	"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := c.GetHeader("Authorization")

		parts := strings.Split(tokenStr, " ")
		if len(parts) != 2 {
			c.JSON(401, gin.H{"error": "invalid authorization header"})
			c.Abort()
			return
		}

		token := parts[1]
		if token == "" {
			c.JSON(401, gin.H{"error": "missing token"})
			c.Abort()
			return
		}
		userID, email, role, err := utils.ParseTokenToUser(token)

		if err != nil {
			c.JSON(401, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		// store user info in the context for controllers

		c.Set("userID", userID)
		c.Set("email", email)
		c.Set("role", role)

		c.Next()
	}
}
