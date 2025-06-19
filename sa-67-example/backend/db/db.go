// db/db.go
package db

import (
	"log"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"sa-67-example/entity"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("healthcare.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database")
	}
	DB.AutoMigrate(&entity.Patient{}, &entity.Psychologist{})
}
