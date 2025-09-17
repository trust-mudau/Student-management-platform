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
import { toast } from "sonner"
import { MoreHorizontal, Edit, Trash2, Plus, GraduationCap } from "lucide-react"

export default function Lecturers() {
  const { user } = useAuth()
  const [lecturers, setLecturers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingLecturer, setEditingLecturer] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    LastName: "",
    contactEmail: "",
    contactPhone: "",
    title: "",
    LecturerStatus: "",
    department: "",
  })

  useEffect(() => {
    fetchLecturers()
    fetchDepartments()
  }, [])

  const fetchLecturers = async () => {
    try {
      const response = await api.get("/lecturer/")
      setLecturers(response.data.lecturers || [])
    } catch (error) {
      console.error("Error fetching lecturers:", error)
      toast.error("Failed to fetch lecturers")
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
      firstName: "",
      LastName: "",
      contactEmail: "",
      contactPhone: "",
      title: "",
      LecturerStatus: "",
      department: "",
    })
    setEditingLecturer(null)
    setShowCreateForm(false)
  }

  const handleCreateLecturer = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/lecturer/", formData)
      toast.success("Lecturer created successfully!")
      resetForm()
      fetchLecturers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lecturer")
    }

    setLoading(false)
  }

  const handleEditLecturer = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put(`/lecturer/${editingLecturer._id}`, formData)
      toast.success("Lecturer updated successfully!")
      resetForm()
      fetchLecturers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update lecturer")
    }

    setLoading(false)
  }

  const handleDeleteLecturer = async (lecturerId) => {
    try {
      await api.delete(`/lecturer/${lecturerId}`)
      toast.success("Lecturer deleted successfully!")
      fetchLecturers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecturer")
    }
  }

  const openEditDialog = (lecturer) => {
    setEditingLecturer(lecturer)
    setFormData({
      firstName: lecturer.firstName,
      LastName: lecturer.LastName,
      contactEmail: lecturer.contactEmail,
      contactPhone: lecturer.contactPhone,
      title: lecturer.title,
      LecturerStatus: lecturer.LecturerStatus,
      department: lecturer.department?._id || "",
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (user?.role !== "Admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lecturers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage lecturer records</p>
        </div>

        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lecturer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Lecturer</DialogTitle>
              <DialogDescription>Create a new lecturer record</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateLecturer}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      name="LastName"
                      required
                      value={formData.LastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <select
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="">Select Title</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="LecturerStatus"
                    required
                    value={formData.LecturerStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="senior Lecturer">Senior Lecturer</option>
                    <option value="junior Lecturer">Junior Lecturer</option>
                    <option value="Professor">Professor</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <select
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
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
                  {loading ? "Creating..." : "Create Lecturer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLecturer} onOpenChange={() => setEditingLecturer(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lecturer</DialogTitle>
            <DialogDescription>Update lecturer information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditLecturer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    name="LastName"
                    required
                    value={formData.LastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="contactEmail"
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <select
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Title</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  name="LecturerStatus"
                  required
                  value={formData.LecturerStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="senior Lecturer">Senior Lecturer</option>
                  <option value="junior Lecturer">Junior Lecturer</option>
                  <option value="Professor">Professor</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingLecturer(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Lecturer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lecturers.map((lecturer) => (
          <Card key={lecturer._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  {lecturer.title} {lecturer.firstName} {lecturer.LastName}
                </CardTitle>
                <CardDescription>{lecturer.LecturerStatus}</CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(lecturer)}>
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
                          This will permanently delete the lecturer "{lecturer.firstName} {lecturer.LastName}". This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteLecturer(lecturer._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-medium text-sm">{lecturer.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="font-medium">{lecturer.contactPhone}</span>
                </div>
                {lecturer.department && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <span className="font-medium text-sm">{lecturer.department.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lecturers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No lecturers available</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first lecturer</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lecturer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
