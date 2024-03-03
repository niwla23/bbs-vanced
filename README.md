https://bbs.noteqr.de

# bbs-parser
Unofficial Parser for bbs-betriebe.de 

Example:

```ts
let token = await getSessionToken("schoolname", "password")
let timetable = await getTimetable(token, "CLASSNAME", new Date("2022-08-31"))
console.log(timetable)
```