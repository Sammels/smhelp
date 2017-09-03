package main


import (
	"../libs/postgres"
	"log"
	"github.com/yanple/vk_api"
	"encoding/json"
	"time"
)


type VkRresponseContent struct {
	Id int `json: uid`
	FirstName string `json: first_name`
	LastName string `json: last_name`
	Online int `json: online`
}

type VkResponse struct {
	Response []VkRresponseContent
}

type error interface {
    Error() string
}


func main() {
	var api = &vk_api.Api{}
	var err error
	api.AccessToken = "41e737d3e413561f8a3bc0a113bf6dfaf2591de9cd78e93f79ea8b11cb61de78959333afc0b9ca94d066e"
	pg_conn := postgres.Init()
	sql_query := "SELECT id, vk_id FROM vk_app_persongroup"
	persons := pg_conn.Find(sql_query)
	params := make(map[string]string)
	params["fields"] = "online"
	log.Println("Checking online is started for ", len(persons))
	for _, person := range persons {
		params["user_ids"] = person["vk_id"].(string)
		strResp, _ := api.Request("users.get", params)
		isOnline, _ := isOnline(strResp)
		if isOnline != 0 {
			slq_insert := "INSERT INTO vk_app_persononline (dt_online, person_id, is_watching) " +
				"VALUES (NOW(), $1, true)"
			_, err = pg_conn.Insert(slq_insert, person["id"])
			if err != nil {
				log.Println(err)
			}
		}
		time.Sleep(300 * time.Millisecond)
	}
}

func isOnline(strResp string) (int,int) {
	res := VkResponse{}
	json.Unmarshal([]byte(strResp), &res)
	if len(res.Response) < 1 {
		return 0, 0
	}
	return res.Response[0].Online, res.Response[0].Id
}