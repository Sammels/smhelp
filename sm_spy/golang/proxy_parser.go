package main

import (
	"strconv"
	"sync"
	"./postgres"
	"./proxy_checker"
	"./proxy_finder"
	"bytes"
)


var maxGorutines = 80


func main() {
	curretnGorutines := proxy_checker.GorutineCounter{}
	proxies_store := []string{}
	var wg sync.WaitGroup
	page := 1
	proxies := proxy_finder.GetProxyList(page)
	for _, proxy := range proxies {
		proxies_store = append(proxies_store, proxy)
	}
	for len(proxies) > 0 {
		page++
		proxies := proxy_finder.GetProxyList(page)
		if len(proxies) <= 0 {
			break
		}
		for _, proxy := range proxies {
			proxies_store = append(proxies_store, proxy)
		}
	}
	proxies_store = get_proxies_from_db(proxies_store)
	wg.Add(len(proxies_store))
	for _, proxy := range proxies_store {
		go proxy_checker.ProxyChecker(proxy, &wg, &curretnGorutines, maxGorutines)
	}
	wg.Wait()
}


func get_proxies_from_db(proxies_store []string) []string {
	pg_conn := postgres.Init()
	proxies := pg_conn.Find("SELECT ip, port FROM twitch_proxies")
	for _, proxy := range proxies {
		var buffer bytes.Buffer
		buffer.WriteString(proxy["ip"].(string))
		buffer.WriteString(":")
		buffer.WriteString(strconv.FormatInt(proxy["port"].(int64), 10))
		proxies_store = append(proxies_store, buffer.String())
	}
	return proxies_store
}



