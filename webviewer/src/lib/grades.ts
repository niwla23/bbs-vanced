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
  ["Mathe", "Deutsch", "Englisch"], // P2
  ["Mathe", "Deutsch", "Englisch"], // P3
  ["BUV", "IV", "Bio", "Deutsch"], // P4
  ["BUV", "IV", "Bio", "Deutsch"], // P5
  ["Deutsch", "Chemie", "Bio", "Mathe", "Englisch", "BUV", "IV"], // subject could be in P2-5 
  ["Deutsch", "Chemie", "Bio", "Mathe", "Englisch", "BUV", "IV"], // subject could be in P2-5 
  ["Geschichte"], // Geschichte
  ["Religion", "WuN"], // Religion
  ["Praxis"],
  ["Sport", "Praxis 2", "Spanisch"] // SP / PRA / SPAN
];

export function checkSubjectsForNeededRelevantGrades(userData: SubjectUserData[]) {
  return userData.map((subject, i) => {
    const count = subject.grades.filter(v => v.relevant).length - 1 // count true values without final exam
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
  if (points == 300) return 4.0
  return -0.0056 * points + 5.592
}

export function countRelevantGrades(userData: SubjectUserData[]) {
  let totalRelevantGrades = 0
  userData.forEach((subject) => {
    const numRelevantGrades = subject.grades.slice(0, 4).filter(v => v.relevant).length
    totalRelevantGrades += numRelevantGrades
  })
  return totalRelevantGrades
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
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 13, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 13, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: false, isGuess: false }, { grade: 13, relevant: false, isGuess: false }, { grade: 14, relevant: true, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: false, isGuess: true }, { grade: 14, relevant: false, isGuess: true }, { grade: 12, relevant: true, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: false, isGuess: true }, { grade: 12, relevant: false, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] },
  { nameOption: 0, grades: [{ grade: 14, relevant: true, isGuess: false }, { grade: 13, relevant: true, isGuess: true }, { grade: 14, relevant: false, isGuess: true }, { grade: 12, relevant: false, isGuess: true }, { grade: 9, relevant: true, isGuess: true }] }
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

