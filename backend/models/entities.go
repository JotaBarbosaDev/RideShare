package models

type Route struct {
	ID        int64   `json:"id"`
	Name      string  `json:"name"`
	StartName string  `json:"startName"`
	EndName   string  `json:"endName"`
	Distance  string  `json:"distance"`
	Price     float64 `json:"price"`
}

type Event struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Start       string `json:"start"`
	End         string `json:"end"`
	Description string `json:"description"`
	PersonsIDs  string `json:"personsID"`
	RouteID     string `json:"routeID"`
}

type Person struct {
	ID         int64  `json:"id"`
	Name       string `json:"name"`
	Pricetopay int    `json:"pricetopay"`
}
