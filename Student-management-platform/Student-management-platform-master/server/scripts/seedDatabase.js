const mongoose = require("mongoose")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
require("dotenv").config()

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Check if data already exists
    const existingFaculties = await Faculty.countDocuments()
    if (existingFaculties > 0) {
      console.log("Database already has data. Skipping seed.")
      process.exit(0)
    }

    console.log("Seeding database...")

    // Create Faculties
    const faculties = [
      {
        name: "Faculty of Science",
        code: "SCI",
        description: "Faculty of Science and Technology",
        contactEmail: "science@university.com",
        contactPhone: "+1234567890",
      },
      {
        name: "Faculty of Arts",
        code: "ART",
        description: "Faculty of Arts and Humanities",
        contactEmail: "arts@university.com",
        contactPhone: "+1234567891",
      },
      {
        name: "Faculty of Engineering",
        code: "ENG",
        description: "Faculty of Engineering",
        contactEmail: "engineering@university.com",
        contactPhone: "+1234567892",
      },
      {
        name: "Faculty of Business",
        code: "BUS",
        description: "Faculty of Business Administration",
        contactEmail: "business@university.com",
        contactPhone: "+1234567893",
      },
      {
        name: "Faculty of Medicine",
        code: "MED",
        description: "Faculty of Medicine and Health Sciences",
        contactEmail: "medicine@university.com",
        contactPhone: "+1234567894",
      },
    ]

    const createdFaculties = await Faculty.insertMany(faculties)
    console.log(`Created ${createdFaculties.length} faculties`)

    // Create Departments
    const departments = [
      // Science Faculty
      {
        name: "Computer Science",
        code: "CSC",
        description: "Department of Computer Science",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Science")._id,
      },
      {
        name: "Mathematics",
        code: "MTH",
        description: "Department of Mathematics",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Science")._id,
      },
      {
        name: "Physics",
        code: "PHY",
        description: "Department of Physics",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Science")._id,
      },
      {
        name: "Chemistry",
        code: "CHM",
        description: "Department of Chemistry",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Science")._id,
      },
      // Arts Faculty
      {
        name: "English Literature",
        code: "ENG",
        description: "Department of English Literature",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Arts")._id,
      },
      {
        name: "History",
        code: "HIS",
        description: "Department of History",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Arts")._id,
      },
      {
        name: "Philosophy",
        code: "PHI",
        description: "Department of Philosophy",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Arts")._id,
      },
      // Engineering Faculty
      {
        name: "Civil Engineering",
        code: "CVE",
        description: "Department of Civil Engineering",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Engineering")._id,
      },
      {
        name: "Electrical Engineering",
        code: "EEE",
        description: "Department of Electrical Engineering",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Engineering")._id,
      },
      {
        name: "Mechanical Engineering",
        code: "MEE",
        description: "Department of Mechanical Engineering",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Engineering")._id,
      },
      // Business Faculty
      {
        name: "Business Administration",
        code: "BBA",
        description: "Department of Business Administration",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Business")._id,
      },
      {
        name: "Accounting",
        code: "ACC",
        description: "Department of Accounting",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Business")._id,
      },
      // Medicine Faculty
      {
        name: "Medicine",
        code: "MED",
        description: "Department of Medicine",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Medicine")._id,
      },
      {
        name: "Nursing",
        code: "NUR",
        description: "Department of Nursing",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Medicine")._id,
      },
    ]

    const createdDepartments = await Department.insertMany(departments)
    console.log(`Created ${createdDepartments.length} departments`)

    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const adminUser = await User.create({
      firstName: "System",
      lastName: "Administrator",
      email: "admin@university.com",
      password: hashedPassword,
      role: "Admin",
      faculty: createdFaculties[0]._id,
      department: createdDepartments[0]._id,
      isActive: true,
    })

    console.log("Created default admin user:")
    console.log("Email: admin@university.com")
    console.log("Password: admin123")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
