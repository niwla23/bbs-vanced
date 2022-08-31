import { getDatestamp, getSessionToken, getTimetable, parseTimetable } from "../src";
import { TimetableLesson, TimetableWeek } from "../src/types";

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

test('parseTimetable returns valid data with given date', async () => {
  let x = new Date("2022-09-01")

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

function mapCompatibleReplacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

// just overengineering tests here
const jsonNeutralizer = (input: string): string => {
  return JSON.stringify(JSON.parse(input), null, 2)
}

test('parseTimetable returns valid data with no given date', async () => {
  let timetable = parseTimetable(fs.readFileSync("testdata/timetable.html").toString())
  const expectedData = jsonNeutralizer(fs.readFileSync("testdata/parsedweek.json").toString()) // not included in repo
  expect([...timetable.keys()]).toHaveLength(7)
  expect(jsonNeutralizer(JSON.stringify(timetable, mapCompatibleReplacer))).toBe(expectedData)
});

test('getTimetable returns valid data with given date', async () => {
  if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.COURSE) {
    expect("USERNAME, COURSE and PASSWORD must be set").toBe("but arent")
    return
  }
  let token = await getSessionToken(process.env.USERNAME, process.env.PASSWORD)
  let x = new Date()
  x.setDate(x.getDate() + 2)

  let timetable = await getTimetable(token, process.env.COURSE, x)
  expect(Array.isArray(timetable)).toBeTruthy()
  if (Array.isArray(timetable)) {
    expect(timetable.length).toBeGreaterThan(2)
  }
});

test('getTimetable returns valid data with fullWeek', async () => {
  if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.COURSE) {
    expect("USERNAME, COURSE and PASSWORD must be set").toBe("but arent")
    return
  }
  let token = await getSessionToken(process.env.USERNAME, process.env.PASSWORD)
  let x = new Date()
  x.setDate(x.getDate() + 2)

  let timetable = await getTimetable(token, process.env.COURSE, x, true)
  console.log(timetable)
  expect(Array.isArray(timetable)).toBeFalsy()
  expect([...timetable.keys()]).toHaveLength(7)
});