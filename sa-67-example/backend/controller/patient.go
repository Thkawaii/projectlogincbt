package controller

import (
	"net/http"
	"sa-67-example/config"
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

	// แปลง password ให้เป็น hash ก่อนบันทึก
	hashedPassword, err := config.HashPassword(patient.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	patient.Password = hashedPassword

	db.DB.Create(&patient)
	c.JSON(http.StatusOK, gin.H{"message": "Patient registered successfully"})
}
type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}


func PatientLogin(c *gin.Context) {
	var payload LoginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	var patient entity.Patient
	if err := db.DB.Where("email = ?", payload.Email).First(&patient).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	// เช็ครหัสผ่าน hashed
	if !config.CheckPasswordHash(payload.Password, patient.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	// ส่ง response ที่ถูกต้องสำหรับ patient
	c.JSON(http.StatusOK, gin.H{
		"message":     "Login successful",
		"userType":    "patient",
		"profileName": patient.FirstName + " " + patient.LastName,
	})
}

