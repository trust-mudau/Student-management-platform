const express = require("express")
const {
  getAllFaculty,
  getMyFaculty,
  deleteFaculty,
  updateFaculty,
  createFaculty,
} = require("../controllers/facultyControllers")
const authenticate = require("../middleware/auth")
const router = express.Router()

//other routes
router.get("/all", getAllFaculty) // Remove authenticate for public access
router.get("/me/:id", authenticate, getMyFaculty)
router.delete("/:id", authenticate, deleteFaculty) // Fixed: was router.get
router.put("/:id", authenticate, updateFaculty) // Fixed: was router.get
router.post("/", createFaculty) // Remove authenticate for setup

module.exports = router
