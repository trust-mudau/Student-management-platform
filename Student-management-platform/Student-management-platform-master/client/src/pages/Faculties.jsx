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
import { MoreHorizontal, Edit, Trash2, Plus, Building } from "lucide-react"

export default function Faculties() {
  const { user } = useAuth()
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  })

  useEffect(() => {
    fetchFaculties()
  }, [])

  const fetchFaculties = async () => {
    try {
      const response = await api.get("/faculty/all")
      setFaculties(response.data || [])
    } catch (error) {
      console.error("Error fetching faculties:", error)
      toast.error("Failed to fetch faculties")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
    })
    setEditingFaculty(null)
    setShowCreateForm(false)
  }

  const handleCreateFaculty = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/faculty/", formData)
      toast.success("Faculty created successfully!")
      resetForm()
      fetchFaculties()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create faculty")
    }

    setLoading(false)
  }

  const handleEditFaculty = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put(`/faculty/${editingFaculty._id}`, formData)
      toast.success("Faculty updated successfully!")
      resetForm()
      fetchFaculties()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update faculty")
    }

    setLoading(false)
  }

  const handleDeleteFaculty = async (facultyId) => {
    try {
      await api.delete(`/faculty/${facultyId}`)
      toast.success("Faculty deleted successfully!")
      fetchFaculties()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete faculty")
    }
  }

  const openEditDialog = (faculty) => {
    setEditingFaculty(faculty)
    setFormData({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description || "",
      contactEmail: faculty.contactEmail,
      contactPhone: faculty.contactPhone,
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
          <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Faculties</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage faculty records</p>
        </div>

        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Faculty</DialogTitle>
              <DialogDescription>Create a new faculty in the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateFaculty}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Faculty Name</label>
                  <Input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Faculty of Science"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Faculty Code</label>
                  <Input name="code" required value={formData.code} onChange={handleChange} placeholder="e.g., SCI" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input
                    name="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="faculty@university.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone</label>
                  <Input
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Faculty description"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    rows="3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Faculty"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingFaculty} onOpenChange={() => setEditingFaculty(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Faculty</DialogTitle>
            <DialogDescription>Update faculty information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditFaculty}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Faculty Name</label>
                <Input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Faculty of Science"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Faculty Code</label>
                <Input name="code" required value={formData.code} onChange={handleChange} placeholder="e.g., SCI" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input
                  name="contactEmail"
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="faculty@university.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone</label>
                <Input
                  name="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Faculty description"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows="3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingFaculty(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Faculty"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties.map((faculty) => (
          <Card key={faculty._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{faculty.name}</CardTitle>
                <CardDescription>{faculty.code}</CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(faculty)}>
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
                          This will permanently delete the faculty "{faculty.name}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFaculty(faculty._id)}
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
                  <span className="font-medium text-sm">{faculty.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="font-medium">{faculty.contactPhone}</span>
                </div>
                {faculty.description && (
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Description:</span>
                    <p className="text-sm mt-1">{faculty.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {faculties.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No faculties available</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first faculty</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
