package postgres

import (
	"bytes"
	"database/sql"
	_ "github.com/lib/pq"
	"log"
	"os"
)

type DB struct {
	conn sql.DB
}

type error interface {
	Error() string
}

func (db *DB) Insert(sql_query string, args ...interface{}) (int, error) {
	var buffer bytes.Buffer
	lastInsertId := 0
	buffer.WriteString(sql_query)
	buffer.WriteString(" RETURNING id")
	err := db.conn.QueryRow(buffer.String(), args...).Scan(&lastInsertId)
	if err != nil {
		return 0, error(err)
	}
	return lastInsertId, nil
}

func (db *DB) Execute(sql_query string, args ...interface{}) (bool, error) {
	_, err := db.conn.Exec(sql_query, args...)
	if err != nil {
		return false, error(err)
	}
	return true, nil
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
		return_columns := make(map[string]interface{})
		for i, _ := range columns {
			valuePtrs[i] = &values[i]
		}
		rows.Scan(valuePtrs...)
		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte)
			if ok {
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
	dns := "user=docker password=docker dbname=sm_spy sslmode=disable"
	if os.Getenv("ENV") == "development" {
		dns += " port=5433"
	}
	connector, err := sql.Open("postgres", dns)
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
