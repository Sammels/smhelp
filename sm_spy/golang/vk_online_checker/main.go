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
	ID        int    `json:"uid"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Online    int    `json:"online"`
}

type VkResponse struct {
	Response []VkRresponseContent  `json:"response"`
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
		if len(users) >= 200 {
			params["user_ids"] = strings.Join(users, ",")
			strResp, err := api.Request("users.get", params)
			if err != nil {
				log.Println(err)
				continue
			}
			isOnline(strResp, &pg_conn)
			users = []string{}
		}
	}
	params["user_ids"] = strings.Join(users, ",")
	strResp, rerr := api.Request("users.get", params)
	if rerr != nil {
		log.Println(rerr)
		return
	}
	isOnline(strResp, &pg_conn)
	time.Sleep(300 * time.Millisecond)
}

func isOnline(strResp string, pg_conn *postgres.DB) {
	res := VkResponse{}
	json.Unmarshal([]byte(strResp), &res)
	if len(res.Response) < 1 {
		return
	}
	for _, VkResp := range res.Response {
		if VkResp.Online > 0 {
			slq_insert := "INSERT INTO vk_app_persononline (dt_online, person_id, is_watching) " +
				"VALUES (NOW(), (SELECT id FROM vk_app_persongroup WHERE vk_id = $1), true)"
			_, err := pg_conn.Insert(slq_insert, VkResp.ID)
			if err != nil {
				log.Println(err, "----", slq_insert, "----", VkResp.ID)
			}
		}
	}
}
