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
import { MoreHorizontal, Edit, Trash2, Plus, Building2 } from "lucide-react"

export default function Departments() {
  const { user } = useAuth()
  const [departments, setDepartments] = useState([])
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    faculty: "",
  })

  useEffect(() => {
    fetchDepartments()
    fetchFaculties()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department/all")
      setDepartments(response.data || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
      toast.error("Failed to fetch departments")
    }
  }

  const fetchFaculties = async () => {
    try {
      const response = await api.get("/faculty/all")
      setFaculties(response.data || [])
    } catch (error) {
      console.error("Error fetching faculties:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      faculty: "",
    })
    setEditingDepartment(null)
    setShowCreateForm(false)
  }

  const handleCreateDepartment = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/department/", formData)
      toast.success("Department created successfully!")
      resetForm()
      fetchDepartments()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create department")
    }

    setLoading(false)
  }

  const handleEditDepartment = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put(`/department/${editingDepartment._id}`, formData)
      toast.success("Department updated successfully!")
      resetForm()
      fetchDepartments()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update department")
    }

    setLoading(false)
  }

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await api.delete(`/department/${departmentId}`)
      toast.success("Department deleted successfully!")
      fetchDepartments()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete department")
    }
  }

  const openEditDialog = (department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || "",
      faculty: department.faculty?.name || "",
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
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Departments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage department records</p>
        </div>

        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>Create a new department</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDepartment}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department Name</label>
                  <Input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department Code</label>
                  <Input name="code" required value={formData.code} onChange={handleChange} placeholder="e.g., CSC" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Faculty</label>
                  <select
                    name="faculty"
                    required
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty._id} value={faculty.name}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Department description"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    rows="3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || faculties.length === 0}>
                  {loading ? "Creating..." : "Create Department"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditDepartment}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department Name</label>
                <Input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department Code</label>
                <Input name="code" required value={formData.code} onChange={handleChange} placeholder="e.g., CSC" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Faculty</label>
                <select
                  name="faculty"
                  required
                  value={formData.faculty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty.name}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Department description"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows="3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingDepartment(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{department.name}</CardTitle>
                <CardDescription>{department.code}</CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(department)}>
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
                          This will permanently delete the department "{department.name}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDepartment(department._id)}
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
                {department.faculty && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Faculty:</span>
                    <span className="font-medium text-sm">{department.faculty.name}</span>
                  </div>
                )}
                {department.description && (
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Description:</span>
                    <p className="text-sm mt-1">{department.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No departments available</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first department</p>
            <Button onClick={() => setShowCreateForm(true)} disabled={faculties.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
            {faculties.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">Create faculties first before adding departments</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
