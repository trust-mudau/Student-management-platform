const mongoose = require('mongoose')
const Faculty = require('../models/FacultyModel')
const Department = require('../models/DepartmentModel')
const Student = require('../models/UserModel')

const generateRegNo = async (facultyName, departmentName) => {
    //regNo = ${facultcode}/${deptcode}/year2digit/3 studentnum
    const faculty = await Faculty.findOne({ name: facultyName })
    if (!faculty) throw new Error("Faculty not found! Enter a valid faculty name")
    console.log(faculty.code)
    const facultycode = faculty.code;

    const department = await Department.findOne({ name: departmentName, faculty:faculty._id })
    if (!department) throw new Error ("department not found! Enter a valid department name")
    const deptcode = department.code;
    console.log()
    const year = new Date().getFullYear().toString().slice(-2)
    const pre = `${facultycode}/${deptcode}/${year}/`

    // Escape slashes for RegExp
    const escapedPre = pre.replace(/\//g, '\\/');
    const pattern = new RegExp(`^${escapedPre}`)//{regNo: {$regex: `^${pre}`}}
    const count = await Student.countDocuments({ regNo: pattern}) //returns a number
    const studentnum = String(count + 1).padStart(3, '0')

    return `${pre}${studentnum}`

}

module.exports = generateRegNo;
