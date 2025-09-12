package models

import ("gorm.io/gorm",
"github.com/DevPatel1023/Quotation-to-invoice/go-backend/internals/models/Quotation")

type Status string


type Invoice struct {
	gorm.Model

	Name string,
	Description string,
	status Status
}