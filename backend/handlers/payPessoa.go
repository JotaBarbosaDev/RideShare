package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/JotaBarbosaDev/RideShare/backend/db"
)

func PayPessoa(w http.ResponseWriter, r *http.Request) {
	dindinStr := r.FormValue("dindin")
	IDStr := r.FormValue("ID")

	if dindinStr == "" || IDStr == "" {
		http.Error(w, "Missing dindin or ID", http.StatusBadRequest)
		return
	}

	dindin, err := strconv.ParseInt(dindinStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid dindin value", http.StatusBadRequest)
		return
	}

	ID, err := strconv.ParseInt(IDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID value", http.StatusBadRequest)
		return
	}

	if !db.CheckIfPersonExists(ID) {
		http.Error(w, "Invalid ID value", http.StatusBadRequest)
		return
	}

	err = db.PayPessoa(ID, dindin)
	if err != nil {
		http.Error(w, "Failed to process payment", http.StatusInternalServerError)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(200)
}
