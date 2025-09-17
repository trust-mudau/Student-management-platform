const express = require("express")
const Lecturer = require("../models/LecturersModel")

// Get all lecturers
const getAllLecturers = async (req, res) => {
  try {
    console.log("Fetching all lecturers...")

    const { departmentId, page = 1, limit = 10 } = req.query

    const query = { isActive: true }
    if (departmentId) query.department = departmentId

    const lecturers = await Lecturer.find(query)
      .populate("user", "name email")
      .populate("department", "name code")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ LastName: 1 })

    const total = await Lecturer.countDocuments(query)

    console.log(`Found ${lecturers.length} lecturers`)

    res.json({
      lecturers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching lecturers:", error)
    res.status(500).json({
      message: "Failed to fetch lecturers",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

// Get single lecturer
const getMyLecturer = async (req, res) => {
  try {
    const { id } = req.params
    console.log("Fetching lecturer with ID:", id)

    const lecturer = await Lecturer.findById(id)
      .populate("user", "firstName lastName email")
      .populate("department", "name code faculty")

    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    res.json(lecturer)
  } catch (error) {
    console.error("Error fetching lecturer:", error)
    res.status(500).json({
      message: "Failed to fetch lecturer",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

// Create lecturer (Admin only)
const createLecturer = async (req, res) => {
  try {
    console.log("Creating lecturer with data:", req.body)

    // Validate required fields
    const { firstName, LastName, contactEmail, contactPhone, title, LecturerStatus, department } = req.body

    if (!firstName || !LastName || !contactEmail || !contactPhone || !title || !LecturerStatus || !department) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Generate unique employee ID if not provided
    if (!req.body.employeeId) {
      const count = await Lecturer.countDocuments()
      req.body.employeeId = `EMP${String(count + 1).padStart(4, "0")}`
    }

    // Check for existing lecturer with same email
    const existingLecturer = await Lecturer.findOne({
      contactEmail: req.body.contactEmail,
    })

    if (existingLecturer) {
      return res.status(400).json({
        message: "A lecturer with this email already exists",
      })
    }

    const lecturer = new Lecturer(req.body)
    await lecturer.save()

    // Populate the response
    const populatedLecturer = await Lecturer.findById(lecturer._id).populate("department", "name code")

    console.log("Lecturer created successfully:", populatedLecturer._id)
    res.status(201).json({
      message: "Lecturer created successfully",
      lecturer: populatedLecturer,
    })
  } catch (error) {
    console.error("Error creating lecturer:", error)

    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0]
      const message =
        field === "contactEmail"
          ? "Email address already exists"
          : field === "employeeId"
            ? "Employee ID already exists"
            : "Duplicate entry detected"

      res.status(400).json({ message })
    } else if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      res.status(400).json({ message: messages.join(", ") })
    } else {
      res.status(500).json({
        message: "Failed to create lecturer",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  }
}

// Update lecturer (Admin only)
const updateLecturer = async (req, res) => {
  try {
    const { id } = req.params
    console.log("Updating lecturer with ID:", id, "Data:", req.body)

    const lecturer = await Lecturer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("department", "name code")

    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    console.log("Lecturer updated successfully:", lecturer._id)
    res.json(lecturer)
  } catch (error) {
    console.error("Error updating lecturer:", error)

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      const message = field === "contactEmail" ? "Email address already exists" : "Duplicate entry detected"

      res.status(400).json({ message })
    } else {
      res.status(500).json({
        message: "Failed to update lecturer",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  }
}

// Delete lecturer (Admin only)
const deleteLecturer = async (req, res) => {
  try {
    const { id } = req.params
    console.log("Deleting lecturer with ID:", id)

    const lecturer = await Lecturer.findByIdAndUpdate(id, { isActive: false }, { new: true })

    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    console.log("Lecturer deleted successfully:", lecturer._id)
    res.json({ message: "Lecturer deleted successfully" })
  } catch (error) {
    console.error("Error deleting lecturer:", error)
    res.status(500).json({
      message: "Failed to delete lecturer",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

module.exports = {
  getAllLecturers,
  getMyLecturer,
  createLecturer,
  updateLecturer,
  deleteLecturer,
}
