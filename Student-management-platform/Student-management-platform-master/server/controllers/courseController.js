const Course = require("../models/CourseModel")
const Department = require("../models/DepartmentModel")
const Student = require("../models/UserModel")

const getAllCourses = async (req, res) => {
  try {
    console.log("Fetching all courses...")

    const { page = 1, limit = 10, search, lecturer, department, semester, isActive, enrollStudents } = req.query
    const query = { isActive: true }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { code: { $regex: search, $options: "i" } }]
    }
    if (lecturer) query.lecturer = lecturer
    if (department) query.department = department
    if (semester) query.semester = semester

    const courses = await Course.find(query)
      .populate("department", "name code")
      .populate("enrolledStudents", "firstName lastName email")
      .sort({ code: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    console.log(`Found ${courses.length} courses`)

    const total = await Course.countDocuments(query)

    if (courses.length === 0) {
      return res.status(200).json({
        courses: [],
        message: "No courses found",
        totalPages: 0,
        currentPage: page,
        total: 0,
      })
    }

    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

const getMyCourses = async (req, res) => {
  try {
    const { id } = req.params
    console.log("Fetching course with ID:", id)

    const course = await Course.findById(id)
      .populate("department", "name code")
      .populate("enrolledStudents", "firstName lastName email")
      .sort({ code: 1 })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.status(200).json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    res.status(500).json({
      message: "Failed to fetch course",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

const createCourses = async (req, res) => {
  try {
    console.log("Creating course with data:", req.body)

    const { title, code, unit, departmentName, semester } = req.body

    // Validate required fields
    if (!title || !code || !unit || !departmentName || !semester) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const courseExists = await Course.findOne({ title: title })
    if (courseExists) {
      return res.status(409).json({ message: "Course already exists" })
    }

    const foundDept = await Department.findOne({ name: departmentName })
    if (!foundDept) {
      return res.status(404).json({ message: "Department not found" })
    }

    const newcourse = await Course.create({
      title,
      code,
      unit: Number.parseInt(unit),
      department: foundDept._id,
      semester,
    })

    if (!newcourse) {
      return res.status(500).json({ message: "Unable to create course" })
    }

    // Populate the department info before returning
    const populatedCourse = await Course.findById(newcourse._id).populate("department", "name code")

    console.log("Course created successfully:", populatedCourse._id)
    res.status(201).json(populatedCourse)
  } catch (error) {
    console.error("Create course error:", error)
    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params
    console.log("Updating course with ID:", id, "Data:", req.body)

    const course = await Course.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true }).populate(
      "department",
      "name code",
    )

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    console.log("Course updated successfully:", course._id)
    res.status(200).json(course)
  } catch (error) {
    console.error("Update course error:", error)
    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

const deletecourse = async (req, res) => {
  try {
    const { id } = req.params
    console.log("Deleting course with ID:", id)

    const course = await Course.findByIdAndUpdate(id, { isActive: false }, { new: true })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    console.log("Course deleted successfully:", course._id)
    res.status(200).json({ message: "Course successfully deleted" })
  } catch (error) {
    console.error("Delete course error:", error)
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

const enrollStudents = async (req, res) => {
  const { regNo, code } = req.body

  try {
    console.log("Enrolling student:", regNo, "in course:", code)

    // Validate input
    if (!regNo || !code) {
      return res.status(400).json({ message: "Registration number and course code are required" })
    }

    const student = await Student.findOne({ regNo: regNo })
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    const course = await Course.findOne({ code })
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    //Check if already enrolled
    const alreadyEnrolled = student.courses.some((c) => c.courseId.toString() === course._id.toString())
    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Student already enrolled in this course" })
    }

    course.enrolledStudents.push(student._id)
    student.courses.push({ courseId: course._id, courseName: course.title })

    await student.save()
    await course.save()

    console.log("Student enrolled successfully")
    res.status(201).json({ message: "Student enrolled successfully" })
  } catch (error) {
    console.error("Enrollment error:", error)
    res.status(500).json({
      message: "Enrollment failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

const getAllEnrollments = async (req, res) => {
  try {
    console.log("Fetching all enrollments...")

    const courses = await Course.find({ enrolledStudents: { $exists: true, $not: { $size: 0 } } })
      .populate("enrolledStudents", "firstName lastName email")
      .populate("department", "name code")

    console.log(`Found ${courses.length} courses with enrollments`)
    res.status(200).json(courses)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    res.status(500).json({
      message: "Failed to fetch enrollments",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

module.exports = {
  getAllCourses,
  getMyCourses,
  createCourses,
  updateCourse,
  deletecourse,
  getAllEnrollments,
  enrollStudents,
}
