package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/JotaBarbosaDev/RideShare/backend/db"
	"github.com/JotaBarbosaDev/RideShare/backend/models"
)

func CreateRoute(w http.ResponseWriter, r *http.Request) {
	var route models.Route

	route.Name = r.FormValue("Name")
	totalPay, err := strconv.ParseInt(r.FormValue("Price"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid Price to pay", http.StatusBadRequest)
		return
	}
	route.Price = int(totalPay)
	route.StartName = r.FormValue("Start")
	route.EndName = r.FormValue("End")
	route.Distance = r.FormValue("Distance")


	err = db.CreateRoute(route)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Erro ao criar registo", http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(200)
}

func DeleteRoute(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.FormValue("ID"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	err = db.DeleteRoute(id)
	if err != nil {
		http.Error(w, "Erro a apagar o registo", http.StatusInternalServerError)
	}

	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(200)
}

func GetRoutes(w http.ResponseWriter, r *http.Request) {

	events, err := db.GetAllRoutes()
	if err != nil {
		log.Printf("Erro ao obter eventos: %v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(events); err != nil {
		log.Printf("Erro ao codificar resposta JSON: %v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}

