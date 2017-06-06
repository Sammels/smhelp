package postgres

import (
	"database/sql"
	_"github.com/lib/pq"
	"log"
)


type DB struct {
	conn sql.DB
}

func (db *DB) Find(sql_query string) []map[string]interface{} {

	rows, err := db.conn.Query(sql_query)
	if err != nil {
	  log.Fatal(err)
	}

	columns, _ := rows.Columns()
        count := len(columns)
        values := make([]interface{}, count)
        valuePtrs := make([]interface{}, count)
	return_slice := make([]map[string]interface{}, 0)
	for rows.Next() {
		return_columns := make(map[string]interface{} )
		for i, _ := range columns {
			valuePtrs[i] = &values[i]
		}
		rows.Scan(valuePtrs...)
		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte)
			if (ok) {
				v = string(b)
			} else {
				v = val
			}
			return_columns[col] = v
		}
		return_slice = append(return_slice, return_columns)
	}
	return return_slice
}

func (db *DB) init() {
	connector, err := sql.Open("postgres","user=docker password=docker dbname=sm_spy sslmode=disable")
	if err != nil {
	  log.Fatal("Error: The data source arguments are not valid")
	}
	if err != nil {
	  log.Fatal("Error: Could not establish a connection with the database")
	}
	db.conn = *connector
	err = db.conn.Ping()
	if err != nil {
	  log.Fatal("Error: Could not establish a connection with the database")
	}
}

func Init() DB {
	conn := DB{}
	conn.init()
	return conn
}