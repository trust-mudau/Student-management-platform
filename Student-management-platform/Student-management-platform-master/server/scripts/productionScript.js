const mongoose = require("mongoose")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
require("dotenv").config()

const seedProductionData = async () => {
  try {
    console.log("🚀 Starting production database seeding...")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("MongoDB URI:", process.env.MONGO_URI ? "✅ Configured" : "❌ Missing")

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB")

    // Check current state
    const existingFaculties = await Faculty.countDocuments()
    const existingDepartments = await Department.countDocuments()
    const existingUsers = await User.countDocuments()

    console.log("📊 Current database state:")
    console.log(`  - Faculties: ${existingFaculties}`)
    console.log(`  - Departments: ${existingDepartments}`)
    console.log(`  - Users: ${existingUsers}`)

    if (existingFaculties > 0) {
      console.log("⚠️ Database already has faculties. Skipping faculty creation.")
    } else {
      console.log("🏗️ Creating faculties...")

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
      console.log(`✅ Created ${createdFaculties.length} faculties`)

      // Create Departments
      console.log("🏗️ Creating departments...")
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
      console.log(`✅ Created ${createdDepartments.length} departments`)
    }

    // Check if admin user exists
    const adminExists = await User.findOne({ email: "admin@university.com" })
    if (!adminExists) {
      console.log("👤 Creating default admin user...")

      // Get first faculty and department for admin
      const firstFaculty = await Faculty.findOne()
      const firstDepartment = await Department.findOne()

      if (!firstFaculty || !firstDepartment) {
        throw new Error("No faculty or department found for admin user creation")
      }

      const hashedPassword = await bcrypt.hash("admin123", 10)
      const adminUser = await User.create({
        firstName: "System",
        lastName: "Administrator",
        email: "admin@university.com",
        password: hashedPassword,
        role: "Admin",
        faculty: firstFaculty._id,
        department: firstDepartment._id,
        isActive: true,
      })

      console.log("✅ Created default admin user:")
      console.log("   📧 Email: admin@university.com")
      console.log("   🔑 Password: admin123")
      console.log("   👑 Role: Admin")
    } else {
      console.log("👤 Admin user already exists")
    }

    // Final count
    const finalFaculties = await Faculty.countDocuments()
    const finalDepartments = await Department.countDocuments()
    const finalUsers = await User.countDocuments()

    console.log("🎉 Production seeding completed!")
    console.log("📊 Final database state:")
    console.log(`  - Faculties: ${finalFaculties}`)
    console.log(`  - Departments: ${finalDepartments}`)
    console.log(`  - Users: ${finalUsers}`)

    console.log("🚀 Your system is ready!")
    console.log("🌐 Next steps:")
    console.log("   1. Visit your app URL")
    console.log("   2. Go to /login")
    console.log("   3. Login with admin@university.com / admin123")
    console.log("   4. Change the admin password immediately!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding production database:", error)
    console.error("Stack trace:", error.stack)
    process.exit(1)
  }
}

seedProductionData()
