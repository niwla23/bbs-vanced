import { load } from 'cheerio';
import axios from 'axios'
import * as FormData from 'form-data'
import * as fs from 'fs';
import { TimetableDay, TimetableLesson } from './types';

const default_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-GB,en;q=0.6",
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36",
  "Upgrade-Insecure-Requests": "1",
}

const base_url = "https://bbs-betriebe.de"

export async function getSessionToken(user: string, password: string): Promise<string> {
  let bodyFormData = new FormData();
  bodyFormData.append("MAIL", user)
  bodyFormData.append("SCHUELERCODE", password)
  bodyFormData.append("formAction", "login")
  bodyFormData.append("formName", "stacks_in_368_page4")

  let x = await axios.post(`${base_url}/index.php`, bodyFormData, {
    headers: {
      ...default_headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    "maxRedirects": 0,
    "validateStatus": (code) => [200, 204, 301, 302].includes(code)
  })
  fs.writeFileSync("/tmp/test2.html", x.data)

  if (x.headers['set-cookie']) {
    return x.headers['set-cookie'][0].split("=")[1].split(";")[0] // this mess extracts the token from the cookie
  } else {
    throw new Error("no token was returned")
  }
}

export function getDatestamp(date: Date): string {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ]
    .join("-")
}


let TEACHERS_INDEX = 0
let SUBEJCTS_INDEX = 1
let ROOMS_INDEX = 2


/**
 * Extracts a timetable for the given date out of a given html string
 * @constructor
 * @param {string} html - Raw HTML to parse
 * @param {Date} date - Date to get timetable for
 */
export function parseTimetable(html: string, date: Date) {
  const $ = load(html);
  let tables = $(".table")

  let columnIndex: number
  let headings = $(tables[TEACHERS_INDEX]).find("thead > tr > th")
  headings.each((index, heading) => {
    let dateString = $($(heading).find("center").contents().get(2)).text().split(".")
    let currentMonth = Number(dateString[1]) - 1 // why, just why javascript. Why are months 0 indexed
    let currentDayOfMonth = Number(dateString[0])

    // check if this is the correct date
    if (currentMonth === date.getMonth() && currentDayOfMonth === date.getDate()) {
      columnIndex = index
    }
  })

  let timetable: TimetableDay = {}
  tables.each((tableIndex, table) => {
    $(table).find("tbody > tr").each((rowIndex, row) => {

      let hour = Number($($(row).find("td").get(0)).text())
      let cellText: string | null = $($(row).find("td").get(columnIndex)).text().split("(")[0].trim()

      if (cellText === '-') {
        cellText = null
      }

      if (!timetable[hour]) {
        timetable[hour] = { teacher: null, subject: null, room: null }
      }

      switch (tableIndex) {
        case TEACHERS_INDEX:
          timetable[hour].teacher = cellText
          break;
        case SUBEJCTS_INDEX:
          timetable[hour].subject = cellText
          break;
        case ROOMS_INDEX:
          timetable[hour].room = cellText
          break;
      }
    })
  })
  return timetable
}

/**
 * Gets the timetable for the specified date and class
 * @constructor
 * @param {string} token - Session token for authorization
 * @param {string} course - The course / class to get thet table for
 * @param {Date} date - Date to get timetable for
 */
export async function getTimetable(token: string, course: string, date: Date) {
  // date.setHours(0, 0, 0, 0)
  // console.log(date, "huhu")

  let res = await axios.get(`${base_url}/page-3/index.php?KlaBuDatum=${getDatestamp(date)}&Klasse=${course}&Schule=0&HideChangesOff=1&HideChanges=1&StdNachmOff=1&StdNachm=1`, {
    headers: { ...default_headers, "Cookie": `PHPSESSID=${token}` }
  })

  // fs.writeFileSync("testdata/timetable.html", res.data)

  return parseTimetable(res.data, date)
}