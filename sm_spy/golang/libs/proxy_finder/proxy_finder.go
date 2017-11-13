package proxy_finder

import (
	"bytes"
	"encoding/base64"
	"github.com/PuerkitoBio/goquery"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

func GetProxyList(page int) []string {
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

func GetFreeProxyList() []string {
	proxy_store := []string{}
	doc, err := goquery.NewDocument("https://free-proxy-list.net")
	if err != nil {
		log.Fatal(err)
	}
	doc.Find("table#proxylisttable tr").Each(func(i int, s *goquery.Selection) {
		re_td, _ := regexp.Compile(`<td>([^<]+)<\/td>`)
		tr_content, _ := s.Html()
		tr_slice := re_td.FindAllStringSubmatch(tr_content, -1)
		if len(tr_slice) > 0 {
			var buffer bytes.Buffer
			buffer.WriteString(tr_slice[0][1])
			buffer.WriteString(":")
			buffer.WriteString(tr_slice[1][1])
			proxy_store = append(proxy_store, buffer.String())
		}

	})
	return proxy_store
}
