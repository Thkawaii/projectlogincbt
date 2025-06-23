package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"sa-67-example/db"
	"sa-67-example/entity"
	"sa-67-example/config"
)

// CreatePsychologist รับข้อมูลนักจิตวิทยา พร้อมอัปโหลดรูปใบรับรอง
func CreatePsychologist(c *gin.Context) {
	// รับข้อมูล form-data (แบบ multipart/form-data)
	firstName := c.PostForm("firstName")
	lastName := c.PostForm("lastName")
	gender := c.PostForm("gender")
	dobStr := c.PostForm("dob") // คาดว่า format จะเป็น "2006-01-02"
	phone := c.PostForm("phone")
	medicalLicense := c.PostForm("medicalLicense")
	email := c.PostForm("email")
	password := c.PostForm("password")

	// แปลง DOB จาก string เป็น time.Time
	dob, err := time.Parse("2006-01-02", dobStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "รูปแบบวันเกิดไม่ถูกต้อง"})
		return
	}

	// อัปโหลดไฟล์ licenseImage
	file, err := c.FormFile("licenseImage")
	var filename string
	if err == nil && file != nil {
		timestamp := time.Now().Unix()
		filename = fmt.Sprintf("uploads/%d_%s", timestamp, file.Filename)
		if err := c.SaveUploadedFile(file, filename); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "ไม่สามารถบันทึกรูปได้"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "กรุณาแนบรูปใบรับรองแพทย์"})
		return
	}

	// Hash รหัสผ่านก่อนบันทึก
	hashed, err := config.HashPassword(password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "ไม่สามารถเข้ารหัสรหัสผ่านได้"})
		return
	}

	// สร้าง entity Psychologist
	psych := entity.Psychologist{
		FirstName:      firstName,
		LastName:       lastName,
		Gender:         gender,
		DOB:            dob,
		Phone:          phone,
		MedicalLicense: medicalLicense,
		Email:          email,
		PasswordHash:   hashed,
		LicenseImage:   filename,
	}

	// บันทึกลงฐานข้อมูล
	if err := db.DB.Create(&psych).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "ไม่สามารถบันทึกข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Psychologist registered successfully", "psychologist": psych})
}
func PsychologistLogin(c *gin.Context) {
	var payload LoginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	var psychologist entity.Psychologist
	if err := db.DB.Where("email = ?", payload.Email).First(&psychologist).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "ไม่พบนักจิตวิทยาที่ใช้อีเมลนี้"})
		return
	}

	if !config.CheckPasswordHash(payload.Password, psychologist.PasswordHash) {
	c.JSON(http.StatusUnauthorized, gin.H{"message": "รหัสผ่านไม่ถูกต้อง"})
	return
}


	c.JSON(http.StatusOK, gin.H{
		"message":     "Login successful",
		"userType":    "psychologist",
		"profileName": psychologist.FirstName + " " + psychologist.LastName,
		"imagePath":   psychologist.LicenseImage,
	})
}
