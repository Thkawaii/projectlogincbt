package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"sa-67-example/db"
	"sa-67-example/entity"
)

func CreatePatient(c *gin.Context) {
	var patient entity.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&patient)
	c.JSON(http.StatusOK, gin.H{"message": "Patient registered successfully"})
}
