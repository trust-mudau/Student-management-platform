const mongoose = require('mongoose')

const lecturerSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    LastName: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    LecturerStatus: {type: String, enum: ["senior Lecturer", "junior Lecturer", "Professor", "Others"], default: "Others"},
    department: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
    faculty: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
    title: {type: String, enum: ["Professor", "Associate Professor", "Assistant Professor", "Lecturer", "Senior Lecturer"]},
    contactEmail: {type: String, required: true},
    contactPhone: {type: String, required: true},
    isActive: {type: Boolean, default: true}
    
}, {timestamps: true})

lecturerSchema.virtual("fullName").get(function () {
  return `${this.title} ${this.firstName} ${this.lastName}`
})

const Lecturer = mongoose.model("Lecturer", lecturerSchema)
module.exports = Lecturer;
