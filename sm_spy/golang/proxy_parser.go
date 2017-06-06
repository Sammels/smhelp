package main

import (
	"net/http"
	"log"
	"io/ioutil"
	"regexp"
	"encoding/base64"
	"strings"
	"strconv"
	"time"
	"net/url"
	"fmt"
	"sync"
	"./postgres"
)

func main() {
	//proxies_store := []string{}
	//var wg sync.WaitGroup
	//page := 1
	//proxies := get_proxy_list(page)

	pg_conn := postgres.Init()
	data := pg_conn.Find("SELECT * FROM auth_user")
	for _, d := range data {
		log.Print(d["username"])
	}

	//for _, proxy := range proxies {
	//	proxies_store = append(proxies_store, proxy)
	//}
	//for len(proxies) > 0 {
	//	page++
	//	proxies := get_proxy_list(page)
	//	if len(proxies) <= 0 {
	//		break
	//	}
	//	for _, proxy := range proxies {
	//		proxies_store = append(proxies_store, proxy)
	//	}
	//}
	//wg.Add(len(proxies_store))
	//for _, proxy := range proxies_store {
	//	go proxy_checker(proxy, &wg)
	//}
	//wg.Wait()
}

func proxy_checker(proxy string, wg *sync.WaitGroup) {
	defer wg.Done()
	proxyUrl, _ := url.Parse(fmt.Sprint("http://", proxy))
	log.Print("Checking ", proxy)
	tr := &http.Transport{
		Proxy: http.ProxyURL(proxyUrl),
	}
	client := &http.Client{Transport: tr, Timeout: 5 * time.Second}
	resp, err := client.Get("https://google.com")
	if err != nil {
		log.Println("Error", err)
	} else {
		log.Println(proxy, ' ', resp.StatusCode, http.ProxyURL(proxyUrl))
	}
	return
}

func get_proxy_list(page int) ([]string) {
	proxy_store := []string{}
	url := strings.Replace("https://proxy-list.org/english/index.php?search=ssl-yes&ssl=yes&p={page}",
		"{page}", strconv.Itoa(page), -1)
	resp, err := http.Get(url)
	if err != nil {
		log.Print("Error", err)
	} else {
		log.Print("Get", url)
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		body_string := string(body[:])
		if err != nil {
			log.Fatal("Error", err)
		}

		re, err := regexp.Compile(`Proxy\('([A-z0-9\=]+)`)
		if err != nil {
			log.Fatal("Error", err)
		}
		if re.MatchString(body_string) {
			proxies := re.FindAllStringSubmatch(body_string, -1)
			for _, proxy := range proxies {
				base64bytes, _ := base64.StdEncoding.DecodeString(proxy[1])
				base64string := string(base64bytes[0:])
				proxy_store = append(proxy_store, base64string)
			}
		} else {
			log.Printf("Not found")
		}
	}
	return proxy_store
}