package postgres

import (
	"database/sql"
	_"github.com/lib/pq"
	"log"
)


type DB struct {
	conn sql.DB
}

func (db *DB) Insert(sql_query string, args ...interface{}) int {
	lastInsertId := 0
	err := db.conn.QueryRow("INSERT INTO brands (name) VALUES($1) RETURNING id", args...).Scan(&lastInsertId)
	if err != nil {
	  log.Fatal(err)
	}
	return lastInsertId
}

func (db *DB) Execute(sql_query string, args ...interface{}) bool {
	_, err := db.conn.Exec(sql_query, args...)
	if err != nil {
	  log.Fatal(err)
	}
	return true
}

func (db *DB) Find(sql_query string, args ...interface{}) []map[string]interface{} {

	rows, err := db.conn.Query(sql_query, args...)
	if err != nil {
	  log.Fatal(err)
	}
	defer rows.Close()
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
	db.conn = *connector
}

func (db *DB) Close() {
	db.conn.Close()
}

func Init() DB {
	conn := DB{}
	conn.init()
	return conn
}