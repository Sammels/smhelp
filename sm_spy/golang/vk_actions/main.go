package main

import (
	"../libs/postgres"
	"../libs/config"
	"../libs/vk_members_group"
	"github.com/yanple/vk_api"
	"log"
	"time"
)

var (
	db postgres.DB
	api vk_api.Api
)

const (
	likeAction = 1
	commentAction = 2
	inAction = 3
	outAction = 4
)

func main() {
	db = postgres.Init()
	api = vk_api.Api{}
	api.AccessToken = config.AccessToken
	groups := db.Find("SELECT * FROM vk_app_watchinggroups")
	for _, group := range groups{
		log.Println("Start collect: ", group["group_id"])
		getNewPersons(group["group_id"].(string), int(group["id"].(int64)))
	}
}

// соберем информацию о вновь прибывших
func getNewPersons(groupVKID string, groupID int) {
	var err error

	persons, err := vk_members_group.GetMembers(config.AccessToken, groupVKID)
	if err != nil {
		log.Println(err)
		return
	}
	for _, item := range persons.Response.Items {
		var dataID int

		data := db.Find("SELECT * FROM vk_app_persongroup WHERE vk_id = $1", item.ID)
		if len(data) == 0 {
			dataID, err = fillVKPerson(item)
			if err != nil {
				log.Println(err)
				continue
			}
		} else {
			dataID = int(data[0]["id"].(int64))
		}
		exists := db.Find(`SELECT EXISTS (SELECT 1 FROM vk_app_personactions WHERE group_id = $1 AND
						person_id = $2 AND action = $3
						AND date_trunc('day', dt_create) = date_trunc('day', NOW()))`,
			dataID, groupID, inAction)
		if exists[0]["exists"].(bool) == true {
			continue
		}
		err = fillVKAction(dataID, groupID, inAction)
		if err != nil {
			log.Println(err)
		}
	}
}

// заполняем таблыицу vk_app_persongroup
func fillVKPerson(item vk_members_group.PersonItems) (int, error) {
	query := `INSERT INTO vk_app_persongroup (vk_id, bdate, first_name, has_mobile, last_name, photo_max_orig,
		sex, city_id, country_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
	return db.Insert(query, item.ID, item.Bdate, item.FirstName, item.HasMobile, item.LastName,
		item.PhotoMaxOrig, item.Sex, item.City, item.Country)
}

// заполняем таблыицу vk_app_persongroup
func fillVKAction(personID int, groupID int, action int) error {
	log.Println("Insert ", action, "to ", groupID, "Person: ", personID)
	query := `INSERT INTO vk_app_personactions (person_id, action, group_id, dt_create) VALUES ($1, $2, $3, $4)`
	_, err := db.Execute(query, personID, action, groupID, time.Now())
	return err
}
