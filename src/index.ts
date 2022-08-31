import { load } from 'cheerio';
import axios from 'axios'
import * as FormData from 'form-data'
import * as fs from 'fs';
import { TimetableLesson, TimetableWeek } from './types';

// so we are definetely a normal browser
const default_headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-GB,en;q=0.6",
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36",
  "Upgrade-Insecure-Requests": "1",
}

// Base URL of the Server.
const base_url = "https://bbs-betriebe.de"

/**
 * Gets a session token from the server. The token is needed for requests that require auth like getting a timetable.
 * 
 * On bbs-betriebe.de the passwords are school-wide. More information can be found on 
 * virtueller-stundenplan.org and per student MS accounts but parsing it is not yet supported
 * 
 * @async
 * @param {string} user - Raw HTML to parse
 * @param {string} password - Date to get timetable for
 */
export async function getSessionToken(user: string, password: string): Promise<string> {
  let bodyFormData = new FormData();
  bodyFormData.append("MAIL", user)
  bodyFormData.append("SCHUELERCODE", password)
  bodyFormData.append("formAction", "login")
  bodyFormData.append("formName", "stacks_in_368_page4")

  const x = await axios.post(`${base_url}/index.php`, bodyFormData, {
    headers: {
      ...default_headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    "maxRedirects": 0,
    "validateStatus": (code) => [200, 204, 301, 302].includes(code)
  })

  if (x.headers['set-cookie']) {
    return x.headers['set-cookie'][0].split("=")[1].split(";")[0] // this mess extracts the token from the cookie
  } else {
    throw new Error("no token was returned")
  }
}

/**
 * Converts a Date to a datestamp as needed by the server
 * @param {Date} date - Date to get timetable for
 * @returns {string} - The constructed datestamp
 */
export function getDatestamp(date: Date): string {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ]
    .join("-")
}

// used to reference the tables by index
const TEACHERS_INDEX = 0
const SUBEJCTS_INDEX = 1
const ROOMS_INDEX = 2


/**
 * Extracts a timetable for the given date out of a given html string
 * @param {string} html - Raw HTML to parse
 * @param {Date} date - Date to get timetable for
 * @returns {TimetableWeek | TimetableLesson[]} The timetable or map of dates and timetables if not date is provided
 */

export function parseTimetable(html: string, date?: Date): TimetableWeek | TimetableLesson[] {
  const $ = load(html);
  const tables = $(".table")

  const headings = $(tables[TEACHERS_INDEX]).find("thead > tr > th")
  let timetable_week: TimetableWeek = new Map() // this is completly dumb, please fix it

  headings.each((index, heading) => {
    const dateString = $($(heading).find("center").contents().get(2)).text().split(".")
    const currentMonth = Number(dateString[1]) - 1 // why, just why javascript. Why are months 0 indexed
    const currentDayOfMonth = Number(dateString[0])
    let currentDate = new Date()
    currentDate.setMonth(currentMonth, currentDayOfMonth)
    currentDate.setHours(12, 0, 0, 0)

    if (isNaN(currentDate.getTime())) {
      return
    }

    let timetable: TimetableLesson[] = []
    tables.each((tableIndex, table) => {
      $(table).find("tbody > tr").each((rowIndex, row) => {

        const hour = Number($($(row).find("td").get(0)).text())
        let cellText: string | null = $($(row).find("td").get(index)).text().split("(")[0].trim()

        if (cellText === '-') {
          cellText = null
        }
        if (!timetable[hour]) {
          timetable.push({ teacher: null, subject: null, room: null, hour: hour })
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


    // cleanup
    let hour = timetable.length;
    while (hour--) {
      const lesson = timetable[hour]
      if (!lesson.room && !lesson.subject && !lesson.teacher) {
        timetable.pop()
      } else {
        break
      }
    }

    timetable_week.set(currentDate, timetable)
  })

  if (date) {
    // check if this is the correct date
    for (const d of timetable_week.keys())
      if (d.getMonth() === date.getMonth() && d.getDate() === date.getDate()) {
        const tt = timetable_week.get(d)
        if (tt) {
          return tt
        } else {
          throw new Error("date not found")
        }
      }
  }

  return timetable_week
}

/**
 * Gets the timetable for the specified date and class
 * @async
 * @param {string} token - Session token for authorization
 * @param {string} course - The course / class to get thet table for
 * @param {Date} date - Date to get timetable for
 * @param {boolean} fullWeek - Returns the plan for the whole week date is in, not just for date
 * @returns {Promise<TimetableLesson[] | TimetableWeek>} Returns a TimetableWeek if `fullWeek` is set otherwise a TimetableLesson array
 */
export async function getTimetable(token: string, course: string, date: Date, fullWeek?: boolean): Promise<TimetableLesson[] | TimetableWeek> {
  const res = await axios.get(`${base_url}/page-3/index.php?KlaBuDatum=${getDatestamp(date)}&Klasse=${course}&Schule=0&HideChangesOff=1&HideChanges=1&StdNachmOff=1&StdNachm=1&StdNullOff=1&StdNull=1`, {
    headers: { ...default_headers, "Cookie": `PHPSESSID=${token}` }
  })

  // fs.writeFileSync("testdata/timetable.html", res.data)

  if (fullWeek) {
    return parseTimetable(res.data)
  } else {
    return parseTimetable(res.data, date)
  }
}