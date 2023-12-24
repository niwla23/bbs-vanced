function subjectPointsBlockI(subject: number[], gradeRelevancy: boolean[]) {
  let pointSum = 0
  for (let i = 0; i < 4; i++) {
    if (gradeRelevancy[i]) pointSum += subject[i]
  }
  return pointSum
}

export function totalPointsBlockI(grades: number[][], isGradeRelevant: boolean[][]) {
  let pointsSum = 0
  for (const [i, subject] of grades.entries()) {
    let points = subjectPointsBlockI(subject, isGradeRelevant[i])
    if (i < 2) {
      points = points * 2
    }
    pointsSum += points
  }
  const totalPoints = pointsSum * 40 / 44
  return totalPoints
}

export function totalPointsBlockII(grades: number[][]) {
  let totalPoints = 0
  for (let i = 0; i <= 4; i++) {
    const blockIIGrade = grades[i][4]
    const blockIIPoints = blockIIGrade * 4
    console.log(blockIIPoints)
    totalPoints += blockIIPoints
  }

  return totalPoints
}

export function totalPointsToGrade(points: number) {
  if (points == 300) return 4.0
  return -0.0056 * points + 5.592
}

export function countRelevantGrades(isGradeRelevant: boolean[][]) {
  let totalRelevantGrades = 0
  isGradeRelevant.forEach((subject) => {
    const numRelevantGrades = subject.slice(0, 4).filter(v => v).length
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
