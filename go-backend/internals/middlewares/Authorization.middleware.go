// internals/middlewares/role_middleware.go
package middlewares

import (
	"github.com/gin-gonic/gin"
)

func AuthorizeRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(403, gin.H{"error": "role not found"})
			c.Abort()
			return
		}

		role := userRole.(string)
		for _, allowed := range roles {
			if role == allowed {
				c.Next()
				return
			}
		}

		c.JSON(403, gin.H{"error": "access denied"})
		c.Abort()
	}
}
