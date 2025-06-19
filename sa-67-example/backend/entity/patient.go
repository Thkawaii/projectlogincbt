// entity/patient.go
package entity

type Patient struct {
    ID              uint   `json:"id" gorm:"primaryKey"`
	FirstName       string `json:"firstName"`
	LastName        string `json:"lastName"`
	Gender          string `json:"gender"`
	Address         string `json:"address"`
	DOB             string `json:"dob"`
	Phone           string `json:"phone"`
	Email           string `json:"email" gorm:"unique"`
	Password        string `json:"password"`
	ConsentAccepted bool   `json:"consent"`
}