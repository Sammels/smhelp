package proxy_checker

import (
	"../postgres"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

type GorutineCounter struct {
	counter int
}

func ProxyChecker(proxy string, wg *sync.WaitGroup, curretnGorutines *GorutineCounter, maxGorutines int) {
	defer wg.Done()
	for curretnGorutines.counter >= maxGorutines {
		time.Sleep(1)
	}
	curretnGorutines.counter++
	pg_conn := postgres.Init()

	defer pg_conn.Close()
	proxy_slice := strings.Split(proxy, ":")
	is_proxy := pg_conn.Find("SELECT id FROM twitch_proxies WHERE ip = $1 AND port = $2",
		proxy_slice[0], proxy_slice[1])
	proxyUrl, _ := url.Parse(fmt.Sprint("http://", proxy))
	log.Print("Checking ", proxy)
	tr := &http.Transport{
		Proxy: http.ProxyURL(proxyUrl),
	}
	client := &http.Client{Transport: tr, Timeout: 5 * time.Second}
	resp, err := client.Get("https://google.com")
	if err != nil {
		log.Println("Error", err, proxy)
		if len(is_proxy) > 0 {
			pg_conn.Execute("UPDATE twitch_proxies SET proxy_status = 0 WHERE id = $1",
				is_proxy[0]["id"])
		}
	} else {
		log.Println(proxy, ' ', resp.StatusCode, http.ProxyURL(proxyUrl))
		pg_conn.Execute("INSERT INTO twitch_proxies (ip, port, proxy_status) VALUES ($1, $2, $3)",
			proxy_slice[0], proxy_slice[1], 1)
	}
	curretnGorutines.counter--
	return
}
