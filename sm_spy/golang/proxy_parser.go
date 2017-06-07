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

type gorutineCounter struct {
	counter int
}
var maxGorutines = 80

func main() {
	curretnGorutines := gorutineCounter{}
	proxies_store := []string{}
	var wg sync.WaitGroup
	page := 1
	proxies := get_proxy_list(page)
	for _, proxy := range proxies {
		proxies_store = append(proxies_store, proxy)
	}
	for len(proxies) > 0 {
		page++
		proxies := get_proxy_list(page)
		if len(proxies) <= 0 {
			break
		}
		for _, proxy := range proxies {
			proxies_store = append(proxies_store, proxy)
		}
	}
	wg.Add(len(proxies_store))
	for _, proxy := range proxies_store {
		go proxy_checker(proxy, &wg, &curretnGorutines)
	}
	wg.Wait()
}

func proxy_checker(proxy string, wg *sync.WaitGroup, curretnGorutines *gorutineCounter) {
	defer wg.Done()
	for (curretnGorutines.counter >= maxGorutines) {
		time.Sleep(1)
	}
	curretnGorutines.counter++
	pg_conn := postgres.Init()

	defer pg_conn.Close()
	proxy_slice := strings.Split(proxy, ":")
	is_proxy := pg_conn.Find("SELECT id FROM twitch_proxies WHERE ip = $1 AND port = $2",
		proxy_slice[0], proxy_slice[1])
	if len(is_proxy) > 0 {
		log.Println(is_proxy, "is exist")
		return
	}
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
		pg_conn.Execute("INSERT INTO twitch_proxies (ip, port, proxy_status) VALUES ($1, $2, $3)",
			proxy_slice[0], proxy_slice[1], 1)
	}
	curretnGorutines.counter--
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