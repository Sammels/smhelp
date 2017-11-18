package main

import (
	"../libs/postgres"
	"encoding/json"
	"fmt"
	"github.com/yanple/vk_api"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

type vkRresponseContent struct {
	Count int			`json:"count"`
	Users []map[string]interface{}  `json:"users"`
}

type vkResponse struct {
	Response vkRresponseContent
}

type error interface {
	Error() string
}

func main() {
	pg_conn := postgres.Init()
	var memberOfGroup []map[string]interface{}
	for _, row := range getGroups(&pg_conn) {
	    	sql := "SELECT * FROM vk_app_queuegroupupdating WHERE " +
		    "group_id = $1"
		groups := pg_conn.Find(sql, row[1])
		log.Println("Groups were found: ", len(groups))
		if len(groups) > 0 {
		    log.Println("Continue ID - ", row[1])
		    continue
		}
		_, err := pg_conn.Execute("INSERT INTO vk_app_queuegroupupdating (group_id, dt_create) VALUES ($1, $2)",
		    row[1], time.Now())
		if err != nil {
		    log.Println(err)
		}
		memberOfGroup = getMembers(row)
		log.Println("Count of members second: ", len(memberOfGroup))
		insertUsers(memberOfGroup, row, &pg_conn)
		_, err = pg_conn.Execute("DELETE FROM vk_app_queuegroupupdating WHERE group_id = $1", row[1])
		if err != nil {
		    log.Println(err)
		}
	}
}

func strAnswerToSlice(vkRespose string) []map[string]interface{} {
	res := vkResponse{}
	err := json.Unmarshal([]byte(vkRespose), &res)
	if err != nil {
		log.Println(err)
	}
	users := res.Response.Users
	return users
}

func getMembers(row []string) []map[string]interface{} {
	var api = &vk_api.Api{}
	offset := 0
	var usersKeeper []map[string]interface{}
	api.AccessToken = "41e737d3e413561f8a3bc0a113bf6dfaf2591de9cd78e93f79ea8b11cb61de78959333afc0b9ca94d066e"
	params := make(map[string]string)
	params["group_id"] = row[0]
	params["version"] = "5.69"
	params["fields"] = "sex,bdate,city,country,photo_max_orig,domain,has_mobile"
	strResp, _ := api.Request("groups.getMembers", params)
	newUsersKeeper := strAnswerToSlice(strResp)
	log.Println(len(newUsersKeeper), "was found, for ", params["group_id"])
	for len(newUsersKeeper) >= 1000 {
		usersKeeper = append(usersKeeper, newUsersKeeper...)
		offset += 1
		params["offset"] = strconv.Itoa(offset * 1000)
		strResp, _ := api.Request("groups.getMembers", params)
		newUsersKeeper = strAnswerToSlice(strResp)
	}
	if len(newUsersKeeper) < 1000 && len(newUsersKeeper) > 0 {
		usersKeeper = append(usersKeeper, newUsersKeeper...)
	}
	log.Println("Count of members: ", len(usersKeeper))
	return usersKeeper
}

func getGroups(pg_conn *postgres.DB) [][]string {
	var groupId string
	if len(os.Args[1:]) > 0 {
		groupId = os.Args[1:][0]
	}
	groups_store := [][]string{}
	sql_query := "SELECT link, id FROM vk_app_watchinggroups WHERE " +
		"dt_last_update < CURRENT_DATE OR dt_last_update is NULL"
	if len(groupId) > 0 {
		groupId_int, _ := strconv.Atoi(groupId)
		sql_query = fmt.Sprintf("%s AND id = %d", sql_query, groupId_int)
	}
	log.Println("sql_query", sql_query)
	groups := pg_conn.Find(sql_query)
	for _, group := range groups {
		group_split := strings.Split(group["link"].(string), "/")
		group_id := group_split[len(group_split)-1]
		msql_id_group := strconv.FormatInt(group["id"].(int64), 10)
		columns := []string{group_id, msql_id_group}
		groups_store = append(groups_store, columns)
	}
	return groups_store
}

func insertUsers(users []map[string]interface{}, row []string, pg_conn *postgres.DB) {

	group_id, _ := strconv.Atoi(row[1])
	current_time := time.Now().Local()
	log.Println("Starting insert", group_id, "Count", len(users))
	for _, user := range users {
		var insertId int
		var err error
		data := pg_conn.Find("SELECT id FROM vk_app_persongroup WHERE vk_id = $1", user["uid"])
		if len(data) > 0 {
			insertId64 := data[0]["id"].(int64)
			insertId = int(insertId64)
		} else {
			insertId, err = pg_conn.Insert("INSERT INTO vk_app_persongroup (vk_id, bdate, first_name, "+
				"has_mobile, last_name, photo_max_orig, sex, city_id, country_id) VALUES ($1, $2, $3, $4, "+
				"$5, $6, $7, $8, $9)", user["uid"], user["bdate"], user["first_name"], user["has_mobile"],
				user["last_name"], user["photo_max_orig"], user["sex"], user["city"], user["country"])
			if err != nil {
				log.Println(err)
				data = pg_conn.Find("SELECT id FROM vk_app_country WHERE id = $1", user["country"])
				if len(data) == 0 {
					pg_conn.Insert("INSERT INTO vk_app_country (id, name)"+
						" VALUES ($1, $2)", user["country"], "Unknow")
				}
				data = pg_conn.Find("SELECT id FROM vk_app_city WHERE id = $1", user["city"])
				if len(data) == 0 {
					pg_conn.Insert("INSERT INTO vk_app_city (id, country_id, name)"+
						" VALUES ($1, $2, $3)", user["city"], user["country"], "Unknow")
				}
				insertId, _ = pg_conn.Insert("INSERT INTO vk_app_persongroup (vk_id, bdate, first_name, "+
					"has_mobile, last_name, photo_max_orig, sex, city_id, country_id) VALUES ($1, $2, $3, $4, "+
					"$5, $6, $7, $8, $9)", user["uid"], user["bdate"], user["first_name"], user["has_mobile"],
					user["last_name"], user["photo_max_orig"], user["sex"], user["city"], user["country"])
			}
		}
		_, errInsert := pg_conn.Execute("INSERT INTO vk_app_personsgroups (group_id, person_id, dt_checking) "+
			"VALUES ($1, $2, $3)", group_id, insertId, current_time)
        if errInsert != nil {
            log.Println(errInsert);
        }
	}
	log.Println("Finish task", group_id)
	pg_conn.Execute("UPDATE vk_app_watchinggroups SET dt_last_update=NOW() WHERE id = $1", group_id)
}
