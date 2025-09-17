const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Others"], default: "Others" },
    phoneNo: { type: String },
    dateOfBirth: { type: Date },
    address: {
      street: String,
      town: String,
      state: String,
      country: String,
      postalCode: Number,
    },
    courses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        courseName: String,
        grade: String,
      },
    ],
    enrollmentDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: function () {
        return this.role === "lecturer" || this.role === "student" || this.role === "Admin"
      },
    },
    role: { type: String, enum: ["student", "Admin", "Lecturer"], default: "student" },
    regNo: {
      type: String,
      required: function () {
        return this.role === "student"
      },
      unique: true,
      sparse: true, // This allows multiple null values
      default: undefined, // Use undefined instead of null
    },
    yearOfStudy: {
      type: Number,
      required: function () {
        return this.role === "student"
      },
      default: function () {
        return this.role === "student" ? new Date().getFullYear() : undefined
      },
    },
  },
  { timestamps: true },
)

// // Create a compound index that allows multiple null values for non-students
// UserSchema.index(
//   { regNo: 1 },
//   {
//     unique: true,
//     sparse: true, // This is crucial - allows multiple documents with missing regNo field
//     partialFilterExpression: { regNo: { $exists: true, $ne: null } }, // Only enforce uniqueness when regNo exists and is not null
//   },
// )

const User = mongoose.model("User", UserSchema)
module.exports = User
