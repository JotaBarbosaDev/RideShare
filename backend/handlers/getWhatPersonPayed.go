package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/JotaBarbosaDev/RideShare/backend/db"
	"github.com/go-chi/chi/v5"
)

func GetWhatPersonPayed(w http.ResponseWriter, r *http.Request) {

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Printf("Erro ao fazer parse do id: %v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if !db.CheckIfPersonExists(id) {
		w.WriteHeader(http.StatusNotFound)
		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode("Pessoa não encontrada")
		return
	}

	price_payed, err := db.GetWhatPersonPayed(id)
	if err != nil {
		log.Printf("Erro ao obter o que a pessoa pagou: %v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(price_payed)
}
