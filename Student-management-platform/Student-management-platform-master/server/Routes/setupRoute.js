const express = require("express")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const router = express.Router()

// Get system status with detailed debugging
router.get("/status", async (req, res) => {
  try {
    console.log("=== SYSTEM STATUS CHECK ===")
    console.log("MongoDB connection state:", mongoose.connection.readyState)
    console.log("MongoDB host:", mongoose.connection.host)
    console.log("MongoDB name:", mongoose.connection.name)

    // Test database connection
    let dbConnected = false
    try {
      await mongoose.connection.db.admin().ping()
      dbConnected = true
      console.log("✅ Database ping successful")
    } catch (pingError) {
      console.error("❌ Database ping failed:", pingError.message)
    }

    const [facultyCount, departmentCount, userCount] = await Promise.all([
      Faculty.countDocuments().catch((err) => {
        console.error("Error counting faculties:", err.message)
        return 0
      }),
      Department.countDocuments().catch((err) => {
        console.error("Error counting departments:", err.message)
        return 0
      }),
      User.countDocuments().catch((err) => {
        console.error("Error counting users:", err.message)
        return 0
      }),
    ])

    console.log("Counts - Faculties:", facultyCount, "Departments:", departmentCount, "Users:", userCount)

    const statusData = {
      status: "success",
      message: "System status retrieved successfully",
      data: {
        faculties: facultyCount,
        departments: departmentCount,
        users: userCount,
        isEmpty: facultyCount === 0 && departmentCount === 0 && userCount === 0,
        dbConnected,
        mongoState: mongoose.connection.readyState,
      },
      debug: {
        mongoUri: process.env.MONGO_URI ? "configured" : "missing",
        jwtSign: process.env.JWT_SIGN ? "configured" : "missing",
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        timestamp: new Date().toISOString(),
      },
    }

    console.log("Status response:", statusData)
    res.json(statusData)
  } catch (error) {
    console.error("❌ Error getting system status:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get system status",
      error: error.message,
      debug: {
        mongoUri: process.env.MONGO_URI ? "configured" : "missing",
        jwtSign: process.env.JWT_SIGN ? "configured" : "missing",
        mongoState: mongoose.connection.readyState,
        timestamp: new Date().toISOString(),
      },
    })
  }
})

// Test database connection endpoint
router.get("/test-db", async (req, res) => {
  try {
    console.log("=== DATABASE CONNECTION TEST ===")
    console.log("MongoDB URI configured:", !!process.env.MONGO_URI)
    console.log("Connection state:", mongoose.connection.readyState)
    console.log("Host:", mongoose.connection.host)
    console.log("Database name:", mongoose.connection.name)

    // Test ping
    await mongoose.connection.db.admin().ping()
    console.log("✅ Database ping successful")

    // Test simple query
    const testDoc = await Faculty.findOne().limit(1)
    console.log("✅ Test query successful, found:", testDoc ? "document" : "no documents")

    res.json({
      status: "success",
      message: "Database connection is working perfectly!",
      details: {
        connectionState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        pingSuccessful: true,
        querySuccessful: true,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Database test failed:", error)
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
      details: {
        connectionState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        timestamp: new Date().toISOString(),
      },
    })
  }
})

// Initialize system with sample data
router.post("/initialize", async (req, res) => {
  try {
    console.log("=== SYSTEM INITIALIZATION STARTED ===")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("MongoDB connection state:", mongoose.connection.readyState)

    // Validate environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set")
    }
    if (!process.env.JWT_SIGN) {
      throw new Error("JWT_SIGN environment variable is not set")
    }

    // Test database connection first
    try {
      await mongoose.connection.db.admin().ping()
      console.log("✅ Database connection verified")
    } catch (pingError) {
      console.error("❌ Database ping failed:", pingError.message)
      throw new Error("Database connection failed: " + pingError.message)
    }

    // Check if already initialized
    const existingFaculties = await Faculty.countDocuments()
    console.log("Existing faculties count:", existingFaculties)

    if (existingFaculties > 0) {
      console.log("⚠️ System already initialized")
      return res.status(400).json({
        status: "error",
        message: "System already initialized",
        data: {
          faculties: existingFaculties,
        },
      })
    }

    console.log("🏗️ Creating faculties...")

    // Create Faculties with error handling
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

    let createdFaculties
    try {
      createdFaculties = await Faculty.insertMany(faculties)
      console.log(`✅ Created ${createdFaculties.length} faculties`)
    } catch (facultyError) {
      console.error("❌ Error creating faculties:", facultyError)
      throw new Error("Failed to create faculties: " + facultyError.message)
    }

    console.log("🏗️ Creating departments...")

    // Create Departments with error handling
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

    let createdDepartments
    try {
      createdDepartments = await Department.insertMany(departments)
      console.log(`✅ Created ${createdDepartments.length} departments`)
    } catch (departmentError) {
      console.error("❌ Error creating departments:", departmentError)
      throw new Error("Failed to create departments: " + departmentError.message)
    }

    console.log("👤 Creating default admin user...")

    // Create default admin user with error handling
    try {
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
      console.log("✅ Created admin user with ID:", adminUser._id)
    } catch (userError) {
      console.error("❌ Error creating admin user:", userError)
      throw new Error("Failed to create admin user: " + userError.message)
    }

    console.log("🎉 System initialization completed successfully!")

    res.json({
      status: "success",
      message: "🎉 System initialized successfully!",
      data: {
        faculties: createdFaculties.length,
        departments: createdDepartments.length,
        adminCreated: true,
        adminCredentials: {
          email: "admin@university.com",
          password: "admin123",
          note: "⚠️ Please change this password after first login!",
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ System initialization failed:", error)
    console.error("Error stack:", error.stack)

    res.status(500).json({
      status: "error",
      message: "Failed to initialize system",
      error: error.message,
      debug: {
        mongoUri: process.env.MONGO_URI ? "configured" : "missing",
        jwtSign: process.env.JWT_SIGN ? "configured" : "missing",
        mongoState: mongoose.connection.readyState,
        mongoHost: mongoose.connection.host,
        mongoDb: mongoose.connection.name,
        timestamp: new Date().toISOString(),
      },
    })
  }
})

// Reset system (for debugging - use with caution)
router.post("/reset", async (req, res) => {
  try {
    console.log("=== SYSTEM RESET STARTED ===")
    console.log("⚠️ WARNING: This will delete all data!")

    // Only allow in development or with special header
    if (process.env.NODE_ENV === "production" && req.headers["x-reset-confirm"] !== "yes-delete-all-data") {
      return res.status(403).json({
        status: "error",
        message: "Reset not allowed in production without confirmation header",
      })
    }

    await Promise.all([Faculty.deleteMany({}), Department.deleteMany({}), User.deleteMany({})])

    console.log("✅ All data deleted")

    res.json({
      status: "success",
      message: "System reset completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ System reset failed:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to reset system",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
