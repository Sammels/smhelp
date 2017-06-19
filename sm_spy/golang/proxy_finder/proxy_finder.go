package proxy_finder

import (
	"strings"
	"strconv"
	"net/http"
	"log"
	"io/ioutil"
	"regexp"
	"encoding/base64"
)


func GetProxyList(page int) ([]string) {
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
			log.Println("Not found")
		}
	}
	return proxy_store
}
