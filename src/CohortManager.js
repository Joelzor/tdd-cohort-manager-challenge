const { Cohort } = require('../src/Cohort')
const { Student } = require('../src/Student')

class CohortManager {
  constructor() {
    this.cohortList = []
    this.studentList = []
  }

  createCohort(name) {
    const id = this.cohortList.length + 1
    this.validateCohortName(name)
    const cohort = new Cohort(name, id)
    this.cohortList.push(cohort)

    return cohort
  }

  createStudent(firstName, lastName, githubUsername, email) {
    const id = this.studentList.length + 1
    const student = new Student(firstName, lastName, githubUsername, email, id)
    this.studentList.push(student)

    return student
  }

  searchCohorts(cohortName) {
    const found = this.cohortList.find((cohort) => cohort.name === cohortName)

    if (!found) throw new Error('No cohorts found!')

    return found
  }

  searchStudents(studentLastname) {
    const found = this.studentList.find(
      (student) => student.lastName === studentLastname
    )

    if (!found) throw new Error('No students found!')

    return found
  }

  addStudentToCohort(studentID, cohortName) {
    const foundStudent = this.searchStudentById(studentID)
    const foundCohort = this.searchCohorts(cohortName)
    const spacesAvailable = this.checkCapacity(cohortName)
    this.validateStudent(foundStudent.id)

    if (foundStudent && foundCohort && spacesAvailable) {
      foundCohort.students.push(foundStudent)
      foundStudent.cohort = foundCohort.name
    }

    return foundCohort
  }

  removeCohort(cohortName) {
    const cohortToRemove = this.searchCohorts(cohortName)

    this.cohortList = this.cohortList.filter(
      (cohort) => cohort.name !== cohortName
    )

    return cohortToRemove
  }

  removeStudent(studentID, cohortName) {
    const foundStudent = this.searchStudentById(studentID)
    const foundCohort = this.searchCohorts(cohortName)

    const found = foundCohort.students.find(
      (student) => student.lastName === foundStudent.lastName
    )

    if (!found)
      throw new Error('There is no student with that name in this cohort')

    foundCohort.students = foundCohort.students.filter(
      (student) => student.id !== studentID
    )

    foundStudent.cohort = 'unassigned'

    return foundCohort
  }

  searchStudentById(id) {
    const found = this.studentList.find((student) => student.id === id)

    if (!found) throw new Error('No students found!')

    return found
  }

  checkCapacity(cohortName) {
    const found = this.searchCohorts(cohortName)

    if (!found) return

    if (found.students.length < found.cohortCapacity) {
      return true
    } else {
      throw new Error('This cohort is at capacity!')
    }
  }

  validateCohortName(cohortName) {
    const found = this.cohortList.find((cohort) => cohort.name === cohortName)

    if (found) {
      throw new Error('A cohort already exists with that name')
    }
  }

  validateStudent(studentID) {
    const found = this.searchStudentById(studentID)
    if (found.cohort !== 'unassigned') {
      throw new Error(
        'This student already has a cohort! Please remove the student from their current cohort before reassigning'
      )
    }
  }

  searchStudentsByFullName(firstName, lastName) {
    if (!firstName || !lastName)
      throw new Error('Please enter both a first and lastName')

    const firstNamesFiltered = this.studentList.filter((student) => {
      return student.firstName.toLowerCase().includes(firstName.toLowerCase())
    })

    const lastNamesFiltered = this.studentList.filter((student) => {
      return student.lastName.toLowerCase().includes(lastName.toLowerCase())
    })

    const fullList = [...firstNamesFiltered, ...lastNamesFiltered]

    const filteredUnique = [...new Set(fullList)]

    if (filteredUnique.length < 1)
      throw new Error('Your search returned no results!')

    return filteredUnique
  }
}

module.exports = { CohortManager }
