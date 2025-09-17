import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Students() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await api.get("/auth/all")
      setStudents(response.data.data || [])
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (user?.role !== "Admin" && user?.role !== "Lecturer") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have permission to view this page.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600">View and manage student records</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student._id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {student.firstName} {student.lastName}
              </CardTitle>
              <CardDescription>{student.regNo}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium text-sm">{student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Role:</span>
                  <span className="font-medium capitalize">{student.role}</span>
                </div>
                {student.faculty && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Faculty:</span>
                    <span className="font-medium text-sm">{student.faculty.name}</span>
                  </div>
                )}
                {student.department && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Department:</span>
                    <span className="font-medium text-sm">{student.department.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Courses:</span>
                  <span className="font-medium">{student.courses?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? "No students found matching your search." : "No students available"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
