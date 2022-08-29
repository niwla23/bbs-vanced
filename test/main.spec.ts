import { getDatestamp, getSessionToken, getTimetable, parseTimetable } from "../src";
import * as fs from 'fs';


test('getSessionToken returns valid token', async () => {
  if (!process.env.USERNAME || !process.env.PASSWORD) {
    expect("USERNAME and PASSWORD must be set").toBe("but arent")
    return
  }
  let token = await getSessionToken(process.env.USERNAME, process.env.PASSWORD)
  console.log(token)
  expect(token).toHaveLength(26);
});

test('getDatestamp work', () => {
  let stamp = getDatestamp(new Date(2022, 7, 29)) // 29.08.2022, month is 0-indexed
  expect(stamp).toBe("2022-08-29")
})

test('parseTimetable returns valid data', async () => {
  let x = new Date()
  x.setDate(x.getDate() + 2)

  let timetable = parseTimetable(fs.readFileSync("testdata/timetable.html").toString(), x)
  expect(Object.keys(timetable)).toHaveLength(16)
  expect(JSON.stringify(timetable, null, 2)).toBe(JSON.stringify({
    '1': { teacher: null, subject: null, room: null },
    '2': { teacher: null, subject: null, room: null },
    '3': { teacher: 'QWE', subject: 'ENG', room: 'D105' },
    '4': { teacher: 'QWE', subject: 'ENG', room: 'D105' },
    '5': { teacher: 'ZUI', subject: 'RELI', room: 'D105' },
    '6': { teacher: 'ZUI', subject: 'RELI', room: 'D105' },
    '7': { teacher: null, subject: null, room: null },
    '8': { teacher: null, subject: null, room: null },
    '9': { teacher: null, subject: null, room: null },
    '10': { teacher: null, subject: null, room: null },
    '11': { teacher: null, subject: null, room: null },
    '12': { teacher: null, subject: null, room: null },
    '13': { teacher: null, subject: null, room: null },
    '14': { teacher: null, subject: null, room: null },
    '15': { teacher: null, subject: null, room: null },
    '16': { teacher: null, subject: null, room: null }
  }, null, 2))
});

test('getTimetable returns valid data', async () => {
  if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.COURSE) {
    expect("USERNAME, COURSE and PASSWORD must be set").toBe("but arent")
    return
  }
  let token = await getSessionToken(process.env.USERNAME, process.env.PASSWORD)
  let x = new Date()
  x.setDate(x.getDate() + 2)

  let timetable = await getTimetable(token, process.env.COURSE, x)
  expect(Object.keys(timetable)).toHaveLength(16)
});