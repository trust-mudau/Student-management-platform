const express = require("express")
const mongoose = require("mongoose")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const User = require("../models/UserModel")
const router = express.Router()

// Health check endpoint
router.get("/", async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState
    const dbStatus = dbState === 1 ? "connected" : "disconnected"

    // Get basic stats
    const [facultyCount, departmentCount, userCount] = await Promise.all([
      Faculty.countDocuments().catch(() => 0),
      Department.countDocuments().catch(() => 0),
      User.countDocuments().catch(() => 0),
    ])

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        connection: dbState,
      },
      stats: {
        faculties: facultyCount,
        departments: departmentCount,
        users: userCount,
      },
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    console.error("Health check failed:", error)
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
    })
  }
})

// Database status endpoint
router.get("/db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }

    res.json({
      status: states[dbState],
      readyState: dbState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
