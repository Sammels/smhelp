package vk_members_group

import (
	"github.com/yanple/vk_api"
	"encoding/json"
	"strconv"
)

// PersonItems : json который выдает API-vk
type PersonItems struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Sex       int    `json:"sex"`
	Domain    string `json:"domain"`
	City      struct {
		ID    int    `json:"id"`
		Title string `json:"title"`
	} `json:"city,omitempty"`
	Country struct {
		ID    int    `json:"id"`
		Title string `json:"title"`
	} `json:"country,omitempty"`
	PhotoMaxOrig interface{} `json:"photo_max_orig"`
	HasMobile    int    `json:"has_mobile,omitempty"`
	Bdate        string `json:"bdate,omitempty"`
	Deactivated  string `json:"deactivated,omitempty"`
}

type PersonVK struct {
	Response struct {
		Count int `json:"count"`
		Items []PersonItems `json:"items"`
	} `json:"response"`
}

// GetMembers : получить всех участников группы
func GetMembers(accessToken string, groupID string) (PersonVK, error) {
	response := PersonVK{}
	fields := "sex,bdate,city,country,photo_max_orig,domain,has_mobile"
	err := getMembers(accessToken, groupID, fields, &response, 0)
	return response, err
}

func getMembers(accessToken string, groupID string, fields string, response *PersonVK, total int) error {
	var api = &vk_api.Api{}
	var err error
	params := map[string]string{}
	localResponse := PersonVK{}

	api.AccessToken = accessToken
	params["v"] = "5.71"
	params["group_id"] = groupID
	params["offset"] = strconv.Itoa(total)
	params["fields"] = fields
	resp, err := api.Request("groups.getMembers", params)
	if err != nil {
		return err
	}
	err = json.Unmarshal([]byte(resp), &localResponse)
	if err != nil {
		return err
	}
	total += len(localResponse.Response.Items)
	response.Response.Items = append(response.Response.Items, localResponse.Response.Items...)
	response.Response.Count += localResponse.Response.Count
	if total < localResponse.Response.Count {
		return getMembers(accessToken, groupID, fields, response, total)
	}
	return err
}
