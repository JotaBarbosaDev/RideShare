package handlers

import (
	"encoding/json"
	"net/http"

	"strconv"

	"github.com/JotaBarbosaDev/RideShare/backend/db"
	"github.com/JotaBarbosaDev/RideShare/backend/models"
)

func CreatePerson(w http.ResponseWriter, r *http.Request) {
	var person models.Person

	person.Name = r.FormValue("Name")
	totalPay, err := strconv.ParseInt(r.FormValue("pricetopay"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid Price to pay", http.StatusBadRequest)
		return
	}
	person.Pricetopay = int(totalPay)

	if person.Name == "" {
		http.Error(w, "Name is empty", http.StatusBadRequest)
		return
	}

	if person.Pricetopay < 0 {
		http.Error(w, "Price to pay is negative", http.StatusBadRequest)
		return
	}

	err = db.CreatePerson(person.Name, person.Pricetopay)
	if err != nil {
		http.Error(w, "Erro ao criar registo", http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(200)
}
