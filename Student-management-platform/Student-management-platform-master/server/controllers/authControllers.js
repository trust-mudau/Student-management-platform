const User = require("../models/UserModel")
const generateRegNo = require("../utility/RegNo")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")

const signup = async (req, res) => {
  const { firstName, lastName, password, email, facultyName, departmentName, role } = req.body

  console.log("Registration attempt:", { firstName, lastName, email, facultyName, departmentName, role })

  try {
    // Validate required fields
    if (!firstName || !lastName || !password || !email || !facultyName || !departmentName) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(409).json({ message: "User already exists, please log in" })

    // Find faculty by name
    const faculty = await Faculty.findOne({ name: facultyName })
    console.log("Found faculty:", faculty)

    if (!faculty) {
      const availableFaculties = await Faculty.find({}, "name")
      console.log(
        "Available faculties:",
        availableFaculties.map((f) => f.name),
      )
      return res.status(404).json({
        message: `Faculty '${facultyName}' not found`,
        availableFaculties: availableFaculties.map((f) => f.name),
      })
    }

    // Find department by name AND faculty
    const department = await Department.findOne({
      name: departmentName,
      faculty: faculty._id,
    })
    console.log("Found department:", department)

    if (!department) {
      // Get all departments for this faculty to help with debugging
      const availableDepartments = await Department.find({ faculty: faculty._id }, "name")
      console.log(
        "Available departments for this faculty:",
        availableDepartments.map((d) => d.name),
      )

      return res.status(404).json({
        message: `Department '${departmentName}' not found in faculty '${facultyName}'`,
        availableDepartments: availableDepartments.map((d) => d.name),
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      password: hashedPassword,
      email,
      department: department._id,
      faculty: faculty._id,
      role: role || "student",
    }

    // Only generate regNo for students
    if (!role || role === "student") {
      try {
        const regNo = await generateRegNo(facultyName, departmentName)
        console.log("Generated regNo:", regNo)
        userData.regNo = regNo
      } catch (regNoError) {
        console.error("Error generating registration number:", regNoError)
        return res.status(500).json({ message: "Failed to generate registration number: " + regNoError.message })
      }
    }
    // For Admin and Lecturer roles, regNo will be undefined (not null)

    console.log("Creating user with data:", { ...userData, password: "[HIDDEN]" })

    // Create user
    const user = await User.create(userData)

    console.log("User created successfully:", { id: user._id, email: user.email, role: user.role, regNo: user.regNo })

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName }, process.env.JWT_SIGN, {
      expiresIn: "24h",
    })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        regNo: user.regNo,
        role: user.role || "student",
      },
      message: "User successfully created",
    })
  } catch (error) {
    console.error("Error occurred while creating account:", error)

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(409).json({ message: "Email already exists" })
      } else if (error.keyPattern?.regNo) {
        return res.status(409).json({ message: "Registration number already exists" })
      } else {
        return res.status(409).json({ message: "Duplicate entry detected" })
      }
    }

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

//controller for login
const login = async (req, res) => {
  const { password, email } = req.body

  console.log("Login attempt for email:", email)

  try {
    // Validate input
    if (!password?.trim() || !email?.trim()) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const user = await User.findOne({ email }).populate("faculty department")
    if (!user) return res.status(404).json({ message: "Email is not registered! Please sign up" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName }, process.env.JWT_SIGN, {
        expiresIn: "24h",
      })

      console.log("Login successful for user:", user.email)

      res.status(200).json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          regNo: user.regNo,
          role: user.role || "student",
        },
        message: "User successfully logged in",
      })
    } else {
      console.log("Password mismatch for user:", email)
      res.status(400).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Error occurred while logging in:", error)
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    })
  }
}

//GET ALL STUDENTS
const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...")

    const users = await User.find({})
      .populate("faculty", "name code")
      .populate("department", "name code")
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 })

    console.log(`Found ${users.length} users`)

    if (users.length === 0) {
      return res.status(200).json({
        data: [],
        message: "No users found",
        total: 0,
      })
    }

    res.status(200).json({
      data: users,
      success: true,
      message: "Users retrieved successfully",
      total: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

//GET A SINGLE STUDENT BY REG NO
const getMyUser = async (req, res) => {
  try {
    const { regNo } = req.params
    console.log("Fetching user with regNo:", regNo)

    const user = await User.findOne({ regNo: regNo })
      .populate("faculty", "name code")
      .populate("department", "name code")
      .select("-password")

    if (!user) {
      return res.status(404).json({ message: `User with regNo: ${regNo} not found!` })
    }

    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        regNo: user.regNo,
        role: user.role,
        faculty: user.faculty,
        department: user.department,
      },
      message: "User retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getMyUser,
}
