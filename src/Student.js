class Student {
  constructor(firstName, lastName, githubUsername, email, id) {
    this.firstName = firstName
    this.lastName = lastName
    this.githubUsername = githubUsername
    this.email = email
    this.id = id
    this.cohort = 'unassigned'
  }
}

module.exports = { Student }
