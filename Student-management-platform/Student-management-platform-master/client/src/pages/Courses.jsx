import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { MoreHorizontal, Edit, Trash2, Plus, BookOpen, Users } from "lucide-react"

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    unit: "",
    departmentName: "",
    semester: "",
  })
  const [enrollData, setEnrollData] = useState({
    regNo: user?.regNo || "",
    code: "",
  })

  useEffect(() => {
    fetchCourses()
    fetchDepartments()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get("/course/all")
      setCourses(response.data.courses || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch courses")
      }
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department/all")
      setDepartments(response.data || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      code: "",
      unit: "",
      departmentName: "",
      semester: "",
    })
    setEditingCourse(null)
    setShowCreateForm(false)
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Creating course with data:", formData)
      const response = await api.post("/course/", formData)
      console.log("Course created:", response.data)
      toast.success("Course created successfully!")
      resetForm()
      fetchCourses()
    } catch (error) {
      console.error("Error creating course:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Failed to create course")
    }

    setLoading(false)
  }

  const handleEditCourse = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put(`/course/${editingCourse._id}`, formData)
      toast.success("Course updated successfully!")
      resetForm()
      fetchCourses()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course")
    }

    setLoading(false)
  }

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/course/${courseId}`)
      toast.success("Course deleted successfully!")
      fetchCourses()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course")
    }
  }

  const handleEnrollCourse = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/course/enroll", enrollData)
      toast.success("Enrolled successfully!")
      setShowEnrollForm(false)
      setEnrollData({
        regNo: user?.regNo || "",
        code: "",
      })
      fetchCourses()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll")
    }

    setLoading(false)
  }

  const openEditDialog = (course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      code: course.code,
      unit: course.unit.toString(),
      departmentName: course.department?.name || "",
      semester: course.semester,
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEnrollChange = (e) => {
    setEnrollData({
      ...enrollData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and view courses</p>
        </div>
        <div className="flex space-x-2">
          {user?.role === "student" && (
            <Dialog open={showEnrollForm} onOpenChange={setShowEnrollForm}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Enroll in Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enroll in Course</DialogTitle>
                  <DialogDescription>Register for a new course</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEnrollCourse}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Registration Number</label>
                      <Input
                        name="regNo"
                        required
                        value={enrollData.regNo}
                        onChange={handleEnrollChange}
                        placeholder="Your registration number"
                        disabled={user?.role === "student"}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course Code</label>
                      <Input
                        name="code"
                        required
                        value={enrollData.code}
                        onChange={handleEnrollChange}
                        placeholder="Enter course code"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowEnrollForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Enrolling..." : "Enroll"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {(user?.role === "Admin" || user?.role === "Lecturer") && (
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>Add a new course to the system</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course Title</label>
                      <Input
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter course title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course Code</label>
                      <Input
                        name="code"
                        required
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter course code"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Units</label>
                      <Input
                        name="unit"
                        type="number"
                        min="1"
                        max="6"
                        required
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder="Enter units"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Semester</label>
                      <select
                        name="semester"
                        required
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="">Select Semester</option>
                        <option value="Ist Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <select
                        name="departmentName"
                        required
                        value={formData.departmentName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Course"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCourse}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Title</label>
                <Input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Course Code</label>
                <Input
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter course code"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Units</label>
                <Input
                  name="unit"
                  type="number"
                  min="1"
                  max="6"
                  required
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="Enter units"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <select
                  name="semester"
                  required
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Semester</option>
                  <option value="Ist Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <select
                  name="departmentName"
                  required
                  value={formData.departmentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingCourse(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </div>

              {(user?.role === "Admin" || user?.role === "Lecturer") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(course)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the course "{course.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCourse(course._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Units:</span>
                  <Badge variant="secondary">{course.unit}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Semester:</span>
                  <Badge variant="outline">{course.semester}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Enrolled:</span>
                  <Badge variant="secondary">{course.enrolledStudents?.length || 0}</Badge>
                </div>
                {course.department && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <span className="font-medium text-sm">{course.department.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses available</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first course</p>
            {(user?.role === "Admin" || user?.role === "Lecturer") && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
