package main

import (
	"../libs/postgres"
	"github.com/yanple/vk_api"
	"log"
	"encoding/json"
	"time"
)

const token = "41e737d3e413561f8a3bc0a113bf6dfaf2591de9cd78e93f79ea8b11cb61de78959333afc0b9ca94d066e"

type VKResponse struct {
	Response struct {
		Count int `json:"count"`
		Items []struct {
			ID          int    `json:"id"`
			FromID      int    `json:"from_id"`
			OwnerID     int    `json:"owner_id"`
			Date        int64  `json:"date"`
			MarkedAsAds int    `json:"marked_as_ads"`
			PostType    string `json:"post_type"`
			Text        string `json:"text"`
			IsPinned    int    `json:"is_pinned,omitempty"`
			Attachments []struct {
				Type  string `json:"type"`
				Photo struct {
					ID        int    `json:"id"`
					AlbumID   int    `json:"album_id"`
					OwnerID   int    `json:"owner_id"`
					UserID    int    `json:"user_id"`
					Photo75   string `json:"photo_75"`
					Photo130  string `json:"photo_130"`
					Photo604  string `json:"photo_604"`
					Photo807  string `json:"photo_807"`
					Photo1280 string `json:"photo_1280"`
					Width     int    `json:"width"`
					Height    int    `json:"height"`
					Text      string `json:"text"`
					Date      int64  `json:"date"`
					PostID    int    `json:"post_id"`
					AccessKey string `json:"access_key"`
				} `json:"photo"`
			} `json:"attachments"`
			Comments struct {
				Count int `json:"count"`
			} `json:"comments"`
			Likes struct {
				Count int `json:"count"`
			} `json:"likes"`
			Reposts struct {
				Count int `json:"count"`
			} `json:"reposts"`
			Views struct {
				Count int `json:"count"`
			} `json:"views"`
		} `json:"items"`
	} `json:"response"`
}

func main() {
	pg_conn := postgres.Init()
	sql_query := "SELECT id, group_id FROM vk_app_watchinggroups"
	existSQL := "SELECT EXISTS  ( SELECT *  FROM vk_app_postgroup  WHERE group_id = $1 AND vk_id = $2)"

	groups := pg_conn.Find(sql_query)
	for _, groupOne := range groups {
		log.Print("Group: ", groupOne)
		wall, err := getWall(groupOne["group_id"].(string))
		if err != nil {
			log.Print(err)
			continue
		}
		log.Print("Total count: ", wall.Response.Count)

		for _, post := range  wall.Response.Items {
			exists := pg_conn.Find(existSQL, groupOne["id"],  post.ID)
			if exists[0]["exists"].(bool) == true {
				postID := pg_conn.Find("SELECT id  FROM vk_app_postgroup  WHERE group_id = $1 AND vk_id = $2", groupOne["id"],  post.ID)
				for _, postIDOne := range postID {
					_, err := pg_conn.Execute("DELETE FROM vk_app_attachpostgroup WHERE post_id = $1", postIDOne["id"])
					if err != nil {
						log.Print(err)
						continue
					}
					_, err = pg_conn.Execute("DELETE FROM vk_app_postgroup WHERE id = $1", postIDOne["id"])
					if err != nil {
						log.Print(err)
						continue
					}
				}
			}
			insertID, errExec := pg_conn.Insert("INSERT INTO vk_app_postgroup " +
				"(vk_id, dt_create, text, group_id, comments, likes, reposts, views) " +
					"VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", post.ID, time.Unix(post.Date, 0),
						post.Text, groupOne["id"].(int64),
						post.Comments.Count, post.Likes.Count, post.Reposts.Count, post.Views.Count)
			if errExec != nil {
				log.Print(errExec)
				continue
			}
			for _, attach := range post.Attachments {
				if attach.Type != "photo" {
					continue
				}
				_, errAttach := pg_conn.Execute("INSERT INTO vk_app_attachpostgroup " +
					"(dt_create, photo_1280, photo_807, photo_604, title, type, description, " +
						"comments, views, post_id, vk_id) " +
							"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", time.Unix(attach.Photo.Date, 0),
							attach.Photo.Photo1280, attach.Photo.Photo807,
							attach.Photo.Photo604, "", attach.Type, attach.Photo.Text, 0, 0,
								insertID, attach.Photo.ID)
				if errAttach != nil {
					log.Print(errAttach)
					continue
				}
			}
		}
		time.Sleep(1 * time.Second)
	}
}

func getWall(domain string) (VKResponse, error) {
	var api = &vk_api.Api{}
	res := VKResponse{}
	api.AccessToken = token
	params := map[string]string{}
	params["v"] = "5.69"
	params["domain"] = domain
	params["count"] = "100"
	strResp, err := api.Request("wall.get", params)
	if err != nil {
		log.Println(err)
		return res, err
	}
	errJson := json.Unmarshal([]byte(strResp), &res)
	if errJson != nil {
		log.Println(errJson, " ", strResp)
		return res, errJson
	}
	return res, nil
}
