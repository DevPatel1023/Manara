package ratelimit

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// rate limiter with 1 req per second and a burst of 5
var limiter = rate.NewLimiter(1, 5)

// middleware to check rate limiter
func RateLimiter(c *gin.Context) {
	println("ratelimit")
	if !limiter.Allow() {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "too many requests"})
		c.Abort()
		return
	}
	c.Next()
}
