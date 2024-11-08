package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/JotaBarbosaDev/RideShare/backend/db"
	"github.com/go-chi/chi/v5"
)

func DebtPessoa(w http.ResponseWriter, r *http.Request) {

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

	events, err := db.GetAllEvents()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(err)
		return
	}

	price_to_pay := 0.0
	for i := 0; i < len(events); i++ {
		persons_arr := strings.Split(events[i].PersonsIDs, "//")
		for j := 0; j < len(persons_arr); j++ {
			if persons_arr[j] == strconv.FormatInt(id, 10) {
				routeID, err := strconv.ParseInt(events[i].RouteID, 10, 64)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Header().Add("Content-Type", "application/json")
					json.NewEncoder(w).Encode(err)
					return
				}
				route_price, err := db.GetRoutePrice(routeID)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Header().Add("Content-Type", "application/json")
					json.NewEncoder(w).Encode(err)
					return
				}
				price_to_pay += float64(route_price) / float64(len(persons_arr))
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(price_to_pay)
}
