package main
	import (
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
	"sa-67-example/db"
	"sa-67-example/controller"
	)
func main() {
	db.ConnectDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Healthcare API running...")
	})

	r.POST("/patients/register", controller.CreatePatient)
	r.POST("/psychologists/register", controller.CreatePsychologist)
	log.Println("Registered route: /psychologists/register")

	log.Println("Server running on http://localhost:8080")
	r.Run(":8080")
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}