package db

import (
	"database/sql"

	"github.com/JotaBarbosaDev/RideShare/backend/models"
	_ "github.com/mattn/go-sqlite3"
)

// Connect to the SQLite database

// EVENTS
func CreateEventDB(title, start, end, description string, personsIDs string, routeID string) error {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("INSERT INTO events (title, start, end, description, personsIDs, routeID) VALUES (?, ?, ?, ?, ?, ?)", title, start, end, description, personsIDs, routeID)
	if err != nil {
		return err
	}
	return nil
}

func DeletEvent(id int64) error {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("DELETE FROM events WHERE id = ?", id)
	if err != nil {
		return err
	}
	return nil
}
func GetEvent(id int64) (models.Event, error) {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return models.Event{}, err
	}
	defer db.Close()

	row := db.QueryRow("SELECT id, title, start, end, description FROM events WHERE id = ?", id)

	var event models.Event
	err = row.Scan(&event.ID, &event.Title, &event.Start, &event.End, &event.Description)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Event{}, nil
		}
		return models.Event{}, err
	}
	return event, nil
}

func GetAllEvents() ([]models.Event, error) {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, title, start, end, description, personsIDs, routeID FROM events")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var event models.Event
		if err := rows.Scan(&event.ID, &event.Title, &event.Start, &event.End, &event.Description, &event.PersonsIDs, &event.RouteID); err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	return events, nil
}

func CheckIfEventExists(id int64) bool {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return false
	}
	defer db.Close()

	row := db.QueryRow("SELECT id FROM events WHERE id = ?", id)

	var event models.Event
	err = row.Scan(&event.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return false
		}
		return false
	}
	return true
}

// PERSON
func CreatePerson(name string, Pricetopay int) error {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("INSERT INTO persons (name, pricetopay) VALUES (?, ?)", name, Pricetopay)
	if err != nil {
		return err
	}
	return nil
}

func DeletPerson(id int64) error {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("DELETE FROM persons WHERE id = ?", id)
	if err != nil {
		return err
	}
	return nil
}
func GetPerson(id int64) (models.Person, error) {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return models.Person{}, err
	}
	defer db.Close()

	row := db.QueryRow("SELECT id, name, pricetopay FROM persons WHERE id = ?", id)

	var person models.Person
	err = row.Scan(&person.ID, &person.Name, &person.Pricetopay)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Person{}, nil
		}
		return models.Person{}, err
	}
	return person, nil
}

func GetAllPersons() ([]models.Person, error) {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, name, pricetopay FROM persons")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var persons []models.Person
	for rows.Next() {
		var person models.Person
		if err := rows.Scan(&person.ID, &person.Name, &person.Pricetopay); err != nil {
			return nil, err
		}
		persons = append(persons, person)
	}
	return persons, nil
}

func PayPessoa(id int64, dindin int64) error {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("UPDATE persons SET pricetopay = pricetopay + ? WHERE id = ?", dindin, id)
	if err != nil {
		return err
	}
	return nil
}

func GetWhatPersonPayed(id int64) (int64, error) {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return 0, err
	}
	defer db.Close()

	row := db.QueryRow("SELECT pricetopay FROM persons WHERE id = ?", id)

	var pricetopay int64
	err = row.Scan(&pricetopay)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}
	return pricetopay, nil
}

func CheckIfPersonExists(id int64) bool {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return false
	}
	defer db.Close()
	row := db.QueryRow("SELECT id FROM persons WHERE id = ?", id)

	var personID int64
	err = row.Scan(&personID)
	if err != nil {
		if err == sql.ErrNoRows {
			return false
		}
		return false
	}
	return true
}

// ROUTES
func CreateRoute(route models.Route) error {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("INSERT INTO routes (name, start, end, distance, price) VALUES (?, ?, ?, ?, ?)", route.Name, route.StartName, route.EndName, route.Distance, route.Price)
	if err != nil {
		return err
	}
	return nil
}

func DeleteRoute(id int64) error {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec("DELETE FROM routes WHERE id = ?", id)
	if err != nil {
		return err
	}
	return nil
}

func GetAllRoutes() ([]models.Route, error) {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM routes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var routes []models.Route
	for rows.Next() {
		var route models.Route
		if err := rows.Scan(&route.ID, &route.Name, &route.StartName, &route.EndName, &route.Distance, &route.Price); err != nil {
			return nil, err
		}
		routes = append(routes, route)
	}
	return routes, nil
}

func CheckIfRouteExists(id int64) bool {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return false
	}
	defer db.Close()

	row := db.QueryRow("SELECT id FROM routes WHERE id = ?", id)

	var route models.Route
	err = row.Scan(&route.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return false
		}
		return false
	}
	return true
}

func GetRoutePrice(id int64) (int64, error) {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		return 0, err
	}
	defer db.Close()

	row := db.QueryRow("SELECT price FROM routes WHERE id = ?", id)

	var price int64
	err = row.Scan(&price)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}
	return price, nil
}

func CreateAllTablesAndFile() {
	db, err := sql.Open("sqlite3", "./rideShare.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	createTableSQL := `CREATE TABLE IF NOT EXISTS events (
		"id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,		
		"title" TEXT,
		"start" TEXT,
		"end" TEXT,
		"description" TEXT,
		"personsIDs" TEXT,
		"routeID" TEXT
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		panic(err)
	}

	createTableSQL = `CREATE TABLE IF NOT EXISTS persons (
		"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,		
		"name" TEXT,
		"pricetopay" INTEGER
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		panic(err)
	}

	createTableSQL = `CREATE TABLE IF NOT EXISTS routes (
		"id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,		
		"name" TEXT,
		"start" TEXT,
		"end" TEXT,
		"distance" TEXT,
		"price" INTEGER
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		panic(err)
	}
}
