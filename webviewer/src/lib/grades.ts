import type { RecordModel, RecordSubscription } from "pocketbase";
import { getAuthenticatedPocketBase } from "./clientAuth";

export interface SubjectUserData {
  nameOption: number;
  grades: Array<{
    grade: number;
    relevant: boolean;
    isGuess: boolean;
  }>;
}


export const numbersOfNeededRelevantGrades = [
  4, // P1 (IT / PP / BRC)
  4, // P2
  4, // P3
  4, // P4
  4, // P5
  4, // subject could be in P2-5 (Deutsch, Chemie, Bio, Mathe, Englisch, BUV, IV)
  4, // subject could be in P2-5
  2, // Geschichte
  2, // Religion
  2, // PRAXIS
  2 // SP / PRA / SPAN
];

export const subjectNameOptions = [
  ["IT", "PP", "BRC"], // P1 (IT / PP / BRC)
  ["Mathe", "Deutsch", "Englisch", "Bio"], // P2
  ["Mathe", "Deutsch", "Englisch", "Bio"], // P3
  ["BUV", "IV", "Bio", "Deutsch", "Englisch"], // P4
  ["BUV", "IV", "Bio", "Deutsch", "Englisch"], // P5
  ["Deutsch", "Chemie", "Bio", "Mathe", "Englisch", "BUV", "IV"], // subject could be in P2-5 
  ["Deutsch", "Chemie", "Bio", "Mathe", "Englisch", "BUV", "IV"], // subject could be in P2-5 
  ["Geschichte"], // Geschichte
  ["Religion", "WuN"], // Religion
  ["Praxis"],
  ["Sport", "Praxis 2", "Spanisch"] // SP / PRA / SPAN
];


export function checkSubjectsForNeededRelevantGrades(userData: SubjectUserData[]) {
  return userData.map((subject, i) => {
    const count = subject.grades.slice(0, 4).filter(v => v.relevant).length // count true values without final exam
    return numbersOfNeededRelevantGrades[i] - count
  })
}

function subjectPointsBlockI(subject: SubjectUserData) {
  let pointSum = 0
  for (let i = 0; i < 4; i++) {
    if (subject.grades[i].relevant) pointSum += subject.grades[i].grade
  }
  return pointSum
}

export function totalPointsBlockI(userData: SubjectUserData[]) {
  let pointsSum = 0
  for (const [i, subject] of userData.entries()) {
    let points = subjectPointsBlockI(subject)
    if (i < 2) {
      points = points * 2
    }
    pointsSum += points
  }
  const totalPoints = pointsSum * 40 / 44
  return totalPoints
}

export function totalPointsBlockII(userData: SubjectUserData[]) {
  let totalPoints = 0
  for (let i = 0; i <= 4; i++) {
    const blockIIGrade = userData[i].grades[4].grade
    const blockIIPoints = blockIIGrade * 4
    totalPoints += blockIIPoints
  }

  return totalPoints
}

export function totalPointsToGrade(points: number) {
  if (points < 300) {
    return 6
  }
  else if (points == 300) {
    return 4
  }
  else if (points >= 301 && points <= 318) {
    return 3.9
  }
  else if (points >= 319 && points <= 336) {
    return 3.8
  }
  else if (points >= 337 && points <= 354) {
    return 3.7
  }
  else if (points >= 355 && points <= 372) {
    return 3.6
  }
  else if (points >= 373 && points <= 390) {
    return 3.5
  }
  else if (points >= 391 && points <= 408) {
    return 3.4
  }
  else if (points >= 409 && points <= 426) {
    return 3.3
  }
  else if (points >= 427 && points <= 444) {
    return 3.2
  }
  else if (points >= 445 && points <= 462) {
    return 3.1
  }
  else if (points >= 463 && points <= 480) {
    return 3.0
  }
  else if (points >= 481 && points <= 498) {
    return 2.9
  }
  else if (points >= 499 && points <= 516) {
    return 2.8
  }
  else if (points >= 517 && points <= 534) {
    return 2.7
  }
  else if (points >= 535 && points <= 552) {
    return 2.6
  }
  else if (points >= 553 && points <= 570) {
    return 2.5
  }
  else if (points >= 571 && points <= 588) {
    return 2.4
  }
  else if (points >= 589 && points <= 606) {
    return 2.3
  }
  else if (points >= 607 && points <= 624) {
    return 2.2
  }
  else if (points >= 625 && points <= 642) {
    return 2.1
  }
  else if (points >= 643 && points <= 660) {
    return 2.0
  }
  else if (points >= 661 && points <= 678) {
    return 1.9
  }
  else if (points >= 679 && points <= 696) {
    return 1.8
  }
  else if (points >= 697 && points <= 714) {
    return 1.7
  }
  else if (points >= 715 && points <= 732) {
    return 1.6
  }
  else if (points >= 733 && points <= 750) {
    return 1.5
  }
  else if (points >= 751 && points <= 768) {
    return 1.4
  }
  else if (points >= 769 && points <= 786) {
    return 1.3
  }
  else if (points >= 787 && points <= 804) {
    return 1.2
  }
  else if (points >= 805 && points <= 822) {
    return 1.1
  }
  else if (points >= 823) {
    return 1.0
  }

  //
  // if (points == 300) return 4.0
  // return -0.0056 * points + 5.592
}

export function countRelevantGrades(userData: SubjectUserData[]) {
  let totalRelevantGrades = 0
  userData.forEach((subject) => {
    const numRelevantGrades = subject.grades.slice(0, 4).filter(v => v.relevant).length
    totalRelevantGrades += numRelevantGrades
  })
  return totalRelevantGrades
}


export function countUnterkurseBlockII(userData: SubjectUserData[]) {
  let unterkurse = 0
  for (let i = 0; i <= 4; i++) {
    const blockIIGrade = userData[i].grades[4].grade
    if (blockIIGrade < 5) unterkurse += 1
  }
  return unterkurse
}


export function blockIIHas0Points(userData: SubjectUserData[]) {
  let zeros = 0
  for (let i = 0; i <= 4; i++) {
    const blockIIGrade = userData[i].grades[4].grade
    if (blockIIGrade == 0) zeros += 1
  }
  return zeros > 0
}

export function pointsToGrade(points: number) {
  return (17 - points) / 3
}

export function pointsToGradePlusMinus(points: number) {
  return ["6", "5-", "5", "5+", "4-", "4", "4+", "3-", "3", "3+", "2-", "2", "2+", "1-", "1", "1+"][Math.round(points)]
}

export function gradeToPoints(grade: number) {
  return 17 - (3 * grade)
}



export const gradeUserDataTemplate: SubjectUserData[] = [
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: true, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: false, isGuess: true }, { grade: 5, relevant: true, isGuess: true }] }
];


export async function saveDataOnline(userData: SubjectUserData[]) {
  const lastUpdate = Number(localStorage.getItem('gradesLastUpdate'));
  if (new Date().getTime() - lastUpdate < 500) return

  const pb = await getAuthenticatedPocketBase();
  if (!pb.authStore.model) throw new Error("no auth model")

  try {
    await pb.collection('users').update(pb.authStore.model.id, { gradesData: { userData } })
  } catch (e) {
    pb.authStore.clear()
  }
}

export async function subscribeOnlineData(callback: (data: RecordSubscription<RecordModel>) => void) {
  const pb = await getAuthenticatedPocketBase()
  if (!pb.authStore.model) throw new Error("no auth model")

  const user = await pb.collection("users").getOne(pb.authStore.model.id)
  if (user.gradesData == null) {
    saveDataOnline(gradeUserDataTemplate)
  }
  await pb.collection("users").subscribe(pb.authStore.model.id, callback)
  return user.gradesData.userData
}

