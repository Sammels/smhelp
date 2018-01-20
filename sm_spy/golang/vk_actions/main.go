package main

import (
	"../libs/postgres"
	"../libs/config"
	"../libs/vk_members_group"
	"github.com/yanple/vk_api"
	"log"
)

var (
	db postgres.DB
	api vk_api.Api
)

func main() {
	db = postgres.Init()
	api = vk_api.Api{}
	api.AccessToken = config.AccessToken
	groupID := "osoba63"
	log.Println("Start collect: ", groupID)
	getNewPersons(groupID)
}

// соберем информацию о вновь прибывших
func getNewPersons(groupID string) {
	var err error

	persons, err := vk_members_group.GetMembers(config.AccessToken, groupID)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println(len(persons.Response.Items))
}
