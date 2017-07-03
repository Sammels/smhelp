package main

import (
	"github.com/yanple/vk_api"
	"custom/proxy_parser/postgres"
	"strings"
	"encoding/json"
	"log"
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
	for _, group_id := range getGroups(&pg_conn) {
		params["group_id"] = group_id
		params["fields"] = "sex,bdate,city,country,photo_max_orig,domain,has_mobile"
		strResp, err := api.Request("groups.getMembers", params)
		if err != nil {
			panic(err)
		}
		if strResp != "" {
			insertUsers(strResp, group_id, &pg_conn)
		}
	}
}

func getGroups(pg_conn *postgres.DB) []string {
	groups_store := []string{}
	groups := pg_conn.Find("SELECT name FROM vk_watchinggroups")
	for _, group := range groups {
		group_split := strings.Split(group["name"].(string), "/")
		group_id := group_split[len(group_split)-1]
		groups_store = append(groups_store, group_id)
	}
	return groups_store
}

func insertUsers(respose string, group_id string, pg_conn *postgres.DB)  {
	res := vkResponse{}
	json.Unmarshal([]byte(respose), &res)
    	users := res.Response.Users
	for _, user := range users {
		pg_conn.Execute("INSERT INTO vk_persongroup (vk_id, group_id, bdate, first_name, " +
			"has_mobile, last_name, photo_max_orig, sex) VALUES ($1, $2, $3, $4, " +
			"$5, $6, $7, $8)", user["domain"], group_id,
			user["bdate"], user["first_name"], user["has_mobile"], user["last_name"],
			user["photo_max_orig"], user["sex"])
	}
}
