import { getDatestamp, getSessionToken, getTimetable, parseTimetable } from "../src";
import * as fs from 'fs';


test('getSessionToken returns valid token', async () => {
  if (!process.env.USERNAME || !process.env.PASSWORD) {
    expect("USERNAME and PASSWORD must be set").toBe("but arent")
    return
  }
  let token = await getSessionToken(process.env.USERNAME, process.env.PASSWORD)
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
  expect(timetable).toHaveLength(9)
  expect(JSON.stringify(timetable, null, 2)).toBe(JSON.stringify([
    { teacher: null, subject: null, room: null, hour: 0 },
    { teacher: null, subject: null, room: null, hour: 1 },
    { teacher: null, subject: null, room: null, hour: 2 },
    { teacher: 'KLB', subject: 'MATHE', room: 'D105', hour: 3 },
    { teacher: 'KLB', subject: 'MATHE', room: 'D105', hour: 4 },
    { teacher: 'HFE', subject: 'CHEMIE', room: 'G009', hour: 5 },
    { teacher: 'HFE', subject: 'CHEMIE', room: 'G009', hour: 6 },
    { teacher: 'BAR', subject: 'BINF', room: 'E004', hour: 7 },
    { teacher: 'BAR', subject: 'BINF', room: 'E004', hour: 8 }
  ], null, 2))
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
  expect(timetable.length).toBeGreaterThan(2)
});