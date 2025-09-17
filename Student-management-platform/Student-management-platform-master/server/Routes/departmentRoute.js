const express = require("express")
const router = express.Router()
const {
  createDepartment,
  getAllDeparments,
  getMyDeparment,
  deleteDepartment,
  updateDepartment,
} = require("../controllers/departmentControllers")
const authenticate = require("../middleware/auth")

router.get("/all", getAllDeparments) // Remove authenticate for public access
router.get("/me:id", authenticate, getMyDeparment)
router.post("/", createDepartment) // Remove authenticate for setup
router.put("/:id", authenticate, updateDepartment)
router.delete("/:id", authenticate, deleteDepartment)

module.exports = router
