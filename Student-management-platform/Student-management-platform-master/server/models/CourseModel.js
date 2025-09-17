const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    code: { type: String, required: true, uppercase: true, unique: true }, // Added unique
    unit: { type: Number, required: true, min: 1, max: 6 },
    lecturer: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }, // Made required
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Fixed: ref should be "User"
    level: { type: String, enum: ["100", "200", "300", "400", "500"] }, // Fixed: String instead of Number
    semester: { type: String, enum: ["Ist Semester", "2nd Semester"], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Course = mongoose.model("Course", courseSchema)
module.exports = Course
