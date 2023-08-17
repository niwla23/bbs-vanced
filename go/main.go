package timetable

import (
	"bytes"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type TimetableLesson struct {
	Hour    *int
	Teacher *string
	Subject *string
	Room    *string
}

type TimetableWeek map[time.Time][]TimetableLesson

// Base URL of the server.
const base_url = "https://bbs-betriebe.de"

// So we are definitely a normal browser.
var default_headers = map[string]string{
	"Accept":                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
	"Accept-Language":           "en-GB,en;q=0.6",
	"User-Agent":                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36",
	"Upgrade-Insecure-Requests": "1",
}

// Gets a session token from the server. The token is needed for requests that require auth like getting a timetable.
// On bbs-betriebe.de the passwords are school-wide.
func getSessionToken(user string, password string) (string, error) {
	formData := url.Values{}
	formData.Set("MAIL", user)
	formData.Set("SCHUELERCODE", password)
	formData.Set("formAction", "login")
	formData.Set("formName", "stacks_in_368_page4")

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/index.php", base_url), bytes.NewBufferString(formData.Encode()))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	for key, value := range default_headers {
		req.Header.Set(key, value)
	}
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	if res.StatusCode != http.StatusOK && res.StatusCode != http.StatusNoContent && res.StatusCode != http.StatusMovedPermanently && res.StatusCode != http.StatusFound {
		return "", errors.New("no token was returned")
	}
	cookies := res.Cookies()
	for _, cookie := range cookies {
		if cookie.Name == "PHPSESSID" {
			return cookie.Value, nil
		}
	}
	return "", errors.New("no token was returned")
}

// Converts a Date to a datestamp as needed by the server.
func getDatestamp(date time.Time) string {
	return fmt.Sprintf("%d-%02d-%02d", date.Year(), date.Month(), date.Day())
}

// Used to reference the tables by index.
const (
	TEACHERS_INDEX = iota
	SUBEJCTS_INDEX
	ROOMS_INDEX
)

// Extracts a timetable for the given date out of a given HTML string.
func parseTimetable(html string, date *time.Time) (TimetableWeek, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, err
	}

	tables := doc.Find(".table")
	headings := tables.Eq(TEACHERS_INDEX).Find("thead > tr > th")
	if headings.Length() == 0 {
		return nil, errors.New("no timetable found")
	}

	timetableWeek := make(TimetableWeek)

	headings.Each(func(index int, heading *goquery.Selection) {
		dateString := heading.Find("center").Contents().Eq(2).Text()
		date, err := time.Parse("2.1.2006", dateString)
		if err != nil {
			return
		}
		date = date.AddDate(time.Now().Year(), 0, 0)

		timetable := make([]TimetableLesson, 0)

		tables.Each(func(tableIndex int, table *goquery.Selection) {
			table.Find("tbody > tr").Each(func(rowIndex int, row *goquery.Selection) {
				hour, err := strconv.Atoi(row.Find("td").Eq(0).Text())
				if err != nil {
					return
				}
				cellText := row.Find("td").Eq(index).Text()
				cellText = strings.Split(cellText, "(")[0]
				cellText = strings.TrimSpace(cellText)

				if cellText == "-" {
					cellText = ""
				}

				if len(timetable) < hour {
					timetable = append(timetable, TimetableLesson{
						Hour: hour,
					})
				}

				switch tableIndex {
				case TEACHERS_INDEX:
					timetable[hour-1].Teacher = cellText
				case SUBEJCTS_INDEX:
					timetable[hour-1].Subject = cellText
				case ROOMS_INDEX:
					timetable[hour-1].Room = cellText
				}
			})
		})

		// cleanup
		for len(timetable) > 0 {
			lesson := timetable[len(timetable)-1]
			if lesson.Room == "" && lesson.Subject == "" && lesson.Teacher == "" {
				timetable = timetable[:len(timetable)-1]
			} else {
				break
			}
		}

		timetableWeek[date] = timetable
	})

	if date != nil {
		for d, timetable := range timetableWeek {
			if d.Month() == date.Month() && d.Day() == date.Day() {
				return timetable, nil
			}
		}
		return nil, errors.New("date not found")
	}

	return timetableWeek, nil
}
