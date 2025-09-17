const { request } = require("express")
const Faculty = require("../models/FacultyModel")

const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true })
      .populate("dean", "title firstName lastName")
      .sort({ name: 1 })
    if (faculty.length === 0) return res.status(200).json({ message: "No faculty found " })
    res.status(200).json(faculty) // Fixed: removed extra object wrapper
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getMyFaculty = async (req, res) => {
  try {
    const { id } = req.params
    const faculty = await Faculty.findById(id).populate("dean", "title firstName lastName").sort({ name: 1 })
    if (!faculty) return res.status(404).json({ message: "faculty not found" }) // Fixed: 404 instead of 200
    res.status(200).json(faculty) // Fixed: removed extra object wrapper
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createFaculty = async (req, res) => {
  try {
    const { name } = req.body
    const faculty = await Faculty.findOne({ name })
    if (faculty) return res.status(409).json({ message: "faculty already exist" })

    const newFaculty = await Faculty.create(req.body)
    if (!newFaculty) return res.status(500).json({ message: "Error creating Faculty" })
    res.status(201).json({ message: "Faculty successfully created", faculty: newFaculty }) // Return created faculty
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

//soft delete
const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params
    const faculty = await Faculty.findByIdAndUpdate(id, { isActive: false }, { new: true }) // Fixed: removed extra object wrapper and variable name
    if (!faculty) return res.status(404).json({ message: "Faculty not found " })
    res.status(200).json({ message: "Faculty deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params
    const faculty = await Faculty.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!faculty) return res.status(404).json({ message: "Faculty not found" })
    res.status(200).json(faculty)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  createFaculty,
  getAllFaculty,
  getMyFaculty,
  deleteFaculty,
  updateFaculty,
}
