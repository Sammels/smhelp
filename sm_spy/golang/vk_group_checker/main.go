package main

import "C"

import (
	"github.com/yanple/vk_api"
	"../libs/postgres"
	"strings"
	"encoding/json"
	"strconv"
	"time"
)


type vkRresponseContent struct {
	Count int
	Users []map[string]interface{}
}

type vkResponse struct {
	Response vkRresponseContent
}

func main() {
	pg_conn := postgres.Init()
	var api = &vk_api.Api{}
	api.AccessToken = "41e737d3e413561f8a3bc0a113bf6dfaf2591de9cd78e93f79ea8b11cb61de78959333afc0b9ca94d066e"
	params := make(map[string]string)
	for _, row := range getGroups(&pg_conn) {
		params["group_id"] = row[0]
		params["fields"] = "sex,bdate,city,country,photo_max_orig,domain,has_mobile"
		strResp, err := api.Request("groups.getMembers", params)
		if err != nil {
			panic(err)
		}
		if strResp != "" {
			insertUsers(strResp, row, &pg_conn)
		}
	}
}

func getGroups(pg_conn *postgres.DB) [][]string {
	groups_store := [][]string{}
	groups := pg_conn.Find("SELECT name, id FROM vk_watchinggroups WHERE " +
		"dt_last_update < CURRENT_DATE OR dt_last_update is NULL")
	for _, group := range groups {
		group_split := strings.Split(group["name"].(string), "/")
		group_id := group_split[len(group_split)-1]
		msql_id_group := strconv.FormatInt(group["id"].(int64), 10)
		columns := []string{group_id, msql_id_group}
		groups_store = append(groups_store, columns)
	}
	return groups_store
}

func insertUsers(respose string, row []string, pg_conn *postgres.DB)  {
	res := vkResponse{}
	json.Unmarshal([]byte(respose), &res)
    	users := res.Response.Users
	group_id, _ := strconv.Atoi(row[1])
	current_time := time.Now().Local()
	for _, user := range users {
		var insertId int
		data := pg_conn.Find("SELECT id FROM vk_persongroup WHERE vk_id = $1", user["domain"])
		if (len(data) > 0) {
			insertId64 := data[0]["id"].(int64)
			insertId = int(insertId64)
		} else {
			insertId = pg_conn.Insert("INSERT INTO vk_persongroup (vk_id, bdate, first_name, " +
				"has_mobile, last_name, photo_max_orig, sex) VALUES ($1, $2, $3, $4, " +
				"$5, $6, $7)", user["domain"], user["bdate"], user["first_name"], user["has_mobile"],
				user["last_name"], user["photo_max_orig"], user["sex"])

		}
		pg_conn.Execute("INSERT INTO vk_personsgroups (group_id, person_id, dt_checking) " +
			"VALUES ($1, $2, $3)", group_id, insertId,  current_time)
	}
	pg_conn.Execute("UPDATE vk_watchinggroups SET dt_last_update=NOW() WHERE id = $1", group_id)
}

