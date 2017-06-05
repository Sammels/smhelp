package db

import (
	"database/sql"
	_"github.com/lib/pq"
	"log"
)

func init() {
	db, err := sql.Open("postgres","user=docker password=docker dbname=sm_spy sslmode=disable")
	if err != nil {
	  log.Fatal("Error: The data source arguments are not valid")
	}
	if err != nil {
	  log.Fatal("Error: Could not establish a connection with the database")
	}

	err = db.Ping()
	if err != nil {
	  log.Fatal("Error: Could not establish a connection with the database")
	}
}

func query(sql_query string) {

	var names []string
	rows, err := db.Query(sql_query)
	if err != nil {
	  log.Fatal(err)
	}
	for rows.Next() {
	  var name string
	  if err := rows.Scan(&name); err != nil {
	    log.Fatal(err)
	  }
	  names = append(names, name)
	}
	log.Print(names, 1)
}