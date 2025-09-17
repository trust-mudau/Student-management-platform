const mongoose = require("mongoose")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")

const seedVercelProduction = async () => {
  try {
    console.log("🚀 Starting Vercel production database seeding...")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Vercel Environment:", process.env.VERCEL_ENV)

    // Validate environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set")
    }
    if (!process.env.JWT_SIGN) {
      throw new Error("JWT_SIGN environment variable is not set")
    }

    console.log("✅ Environment variables validated")

    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
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
      console.log("⚠️ Database already has data. Skipping seeding.")
      console.log("✅ Production database is ready!")
      process.exit(0)
    }

    console.log("🏗️ Creating production data...")

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
    ]

    const createdFaculties = await Faculty.insertMany(faculties)
    console.log(`✅ Created ${createdFaculties.length} faculties`)

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
    ]

    const createdDepartments = await Department.insertMany(departments)
    console.log(`✅ Created ${createdDepartments.length} departments`)

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

    console.log("✅ Created default admin user")
    console.log("📧 Email: admin@university.com")
    console.log("🔑 Password: admin123")
    console.log("👑 Role: Admin")

    // Final verification
    const finalFaculties = await Faculty.countDocuments()
    const finalDepartments = await Department.countDocuments()
    const finalUsers = await User.countDocuments()

    console.log("🎉 Vercel production seeding completed!")
    console.log("📊 Final database state:")
    console.log(`  - Faculties: ${finalFaculties}`)
    console.log(`  - Departments: ${finalDepartments}`)
    console.log(`  - Users: ${finalUsers}`)

    console.log("🚀 Your Vercel production system is ready!")
    console.log("🌐 Next steps:")
    console.log("   1. Visit your Vercel app URL")
    console.log("   2. Go to /login")
    console.log("   3. Login with admin@university.com / admin123")
    console.log("   4. Change the admin password immediately!")

    await mongoose.connection.close()
    console.log("✅ Database connection closed")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding Vercel production database:", error)
    console.error("Stack trace:", error.stack)

    // Provide specific error guidance
    if (error.message.includes("MONGO_URI")) {
      console.error("🔧 SOLUTION: Set MONGO_URI in Vercel environment variables")
    } else if (error.message.includes("authentication failed")) {
      console.error("🔧 SOLUTION: Check MongoDB Atlas username/password")
    } else if (error.message.includes("ECONNREFUSED")) {
      console.error("🔧 SOLUTION: Check MongoDB Atlas network access (whitelist 0.0.0.0/0)")
    }

    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  seedVercelProduction()
}

module.exports = seedVercelProduction
