// internals/middlewares/role_middleware.go
package middlewares

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthorizeRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role") //get role from context where we set role in authentication parse-to-user method

		if !exists {
			c.JSON(403, gin.H{"error": "role not found"})
			c.Abort()
			return
		}

		role := strings.ToLower(userRole.(string))

		// Debug log
		fmt.Printf("User role: %s | Allowed roles: %v\n", role, roles)

		for _, allowed := range roles {
			if role == strings.ToLower(allowed) {
				c.Next()
				return
			}
		}

		c.JSON(403, gin.H{"error": "access denied"})
		c.Abort()
	}
}
