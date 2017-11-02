package main

import (
	"../libs/postgres"
	"encoding/json"
	"github.com/yanple/vk_api"
	"log"
	"time"
	"strings"
)

type VkRresponseContent struct {
	Id        int    `json: uid`
	FirstName string `json: first_name`
	LastName  string `json: last_name`
	Online    int    `json: online`
}

type VkResponse struct {
	Response []VkRresponseContent
}

func main() {
	var api = &vk_api.Api{}
	api.AccessToken = "41e737d3e413561f8a3bc0a113bf6dfaf2591de9cd78e93f79ea8b11cb61de78959333afc0b9ca94d066e"
	pg_conn := postgres.Init()
	sql_query := "SELECT id, vk_id FROM vk_app_persongroup"
	persons := pg_conn.Find(sql_query)
	params := make(map[string]string)
	users := []string{}
	params["fields"] = "online"
	log.Println("Checking online is started for ", len(persons))
    var strResp string
	for _, person := range persons {
		users = append(users, person["vk_id"].(string))
		if len(users) >= 800 {
			params["user_ids"] = strings.Join(users, ",")
			strResp, _ = api.Request("users.get", params)
			isOnline(strResp, &pg_conn, person)
			users = []string{}
		}
	}
    params["user_ids"] = strings.Join(users, ",")
    strResp, _ = api.Request("users.get", params)
    isOnline(strResp, &pg_conn, person)
    time.Sleep(300 * time.Millisecond)
}

func isOnline(strResp string, pg_conn *postgres.DB, person map[string]interface{}) (int, int) {
	res := VkResponse{}
	json.Unmarshal([]byte(strResp), &res)
	if len(res.Response) < 1 {
		return 0, 0
	}
	for _, VkResp := range res.Response {
		if VkResp.Online > 0 {
			slq_insert := "INSERT INTO vk_app_persononline (dt_online, person_id, is_watching) " +
				"VALUES (NOW(), $1, true)"
			_, err := pg_conn.Insert(slq_insert, person["id"])
			if err != nil {
				log.Println(err)
			}
		}
	}
	return res.Response[0].Online, res.Response[0].Id
}
