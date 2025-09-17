const mongoose = require("mongoose")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const User = require("../models/UserModel")
const Course = require("../models/CourseModel")
const Lecturer = require("../models/LecturersModel")
require("dotenv").config()

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    console.log("Clearing all collections...")

    await Promise.all([
      Faculty.deleteMany({}),
      Department.deleteMany({}),
      User.deleteMany({}),
      Course.deleteMany({}),
      Lecturer.deleteMany({}),
    ])

    console.log("Database reset complete!")
    process.exit(0)
  } catch (error) {
    console.error("Error resetting database:", error)
    process.exit(1)
  }
}

resetDatabase()
