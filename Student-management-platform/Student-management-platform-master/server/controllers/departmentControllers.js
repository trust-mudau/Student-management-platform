const Department = require("../models/DepartmentModel")
const Faculty = require("../models/FacultyModel")

const getAllDeparments = async (req, res) => {
  const { facultyId } = req.query
  const query = { isActive: true }
  if (facultyId) query.faculty = facultyId

  try {
    const department = await Department.find(query)
      .populate("faculty", "name code")
      .populate("HOD", "title firstName lastName")
      .sort({ name: 1 })
    if (department.length === 0) return res.status(200).json([]) // Return empty array instead of message
    res.status(200).json(department)
  } catch (error) {
    console.error("Error fetching departments:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getMyDeparment = async (req, res) => {
  try {
    const { id } = req.params
    const department = await Department.findById(id)
      .populate("faculty", "name code")
      .populate("HOD", "title firstName lastName")
      .sort({ name: 1 })
    if (!department) return res.status(404).json({ message: "department not found" })
    res.status(200).json(department)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createDepartment = async (req, res) => {
  const { name, code, description, faculty } = req.body
  try {
    console.log("Creating department with data:", { name, code, description, faculty })

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name })
    if (existingDepartment) return res.status(409).json({ message: "Department already exists" })

    // Find faculty by name
    const targetFaculty = await Faculty.findOne({ name: faculty })
    console.log("Found faculty:", targetFaculty)

    if (!targetFaculty) {
      console.log("Available faculties:", await Faculty.find({}, "name"))
      return res.status(404).json({ message: `Faculty '${faculty}' not found. Please check the faculty name.` })
    }

    const newDepartment = await Department.create({
      name: name,
      code: code,
      description: description,
      faculty: targetFaculty._id,
    })

    console.log("Department created:", newDepartment)

    // Populate the faculty info before returning
    const populatedDepartment = await Department.findById(newDepartment._id).populate("faculty", "name code")

    res.status(201).json({
      message: "Department successfully created",
      department: populatedDepartment,
    })
  } catch (error) {
    console.error("Error creating department:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

//soft delete
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const department = await Department.findByIdAndUpdate(id, { isActive: false }, { new: true })
    if (!department) return res.status(404).json({ message: "department not found " })
    res.status(200).json({ message: "Department deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const department = await Department.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!department) return res.status(404).json({ message: "department not found" })
    res.status(200).json(department)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  createDepartment,
  getAllDeparments,
  getMyDeparment,
  deleteDepartment,
  updateDepartment,
}
