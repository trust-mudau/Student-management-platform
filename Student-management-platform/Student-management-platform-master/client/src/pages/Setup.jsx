import { useState, useEffect } from "react"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function Setup() {
  const [facultyData, setFacultyData] = useState({
    name: "",
    code: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  })
  const [departmentData, setDepartmentData] = useState({
    name: "",
    code: "",
    description: "",
    faculty: "",
  })
  const [loading, setLoading] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    faculties: 0,
    departments: 0,
    users: 0,
  })

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      const [facultiesRes, departmentsRes, usersRes] = await Promise.allSettled([
        api.get("/faculty/all"),
        api.get("/department/all"),
        api.get("/auth/all"),
      ])

      setSystemStatus({
        faculties: facultiesRes.status === "fulfilled" ? facultiesRes.value.data?.length || 0 : 0,
        departments: departmentsRes.status === "fulfilled" ? departmentsRes.value.data?.length || 0 : 0,
        users: usersRes.status === "fulfilled" ? usersRes.value.data?.data?.length || 0 : 0,
      })
    } catch (error) {
      console.error("Error checking system status:", error)
    }
  }

  const handleCreateFaculty = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Creating faculty:", facultyData)
      const response = await api.post("/faculty/", facultyData)
      console.log("Faculty created:", response.data)
      toast.success("Faculty created successfully!")
      setFacultyData({
        name: "",
        code: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
      })
      checkSystemStatus()
    } catch (error) {
      console.error("Error creating faculty:", error)
      toast.error(error.response?.data?.message || "Failed to create faculty")
    }

    setLoading(false)
  }

  const handleCreateDepartment = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Creating department:", departmentData)
      const response = await api.post("/department/", departmentData)
      console.log("Department created:", response.data)
      toast.success("Department created successfully!")
      setDepartmentData({
        name: "",
        code: "",
        description: "",
        faculty: "",
      })
      checkSystemStatus()
    } catch (error) {
      console.error("Error creating department:", error)
      toast.error(error.response?.data?.message || "Failed to create department")
    }

    setLoading(false)
  }

  const handleFacultyChange = (e) => {
    setFacultyData({
      ...facultyData,
      [e.target.name]: e.target.value,
    })
  }

  const handleDepartmentChange = (e) => {
    setDepartmentData({
      ...departmentData,
      [e.target.name]: e.target.value,
    })
  }

  const createSampleData = async () => {
    setLoading(true)
    try {
      console.log("Starting to create sample data...")

      // Create sample faculties
      const faculties = [
        {
          name: "Faculty of Science",
          code: "SCI",
          description: "Faculty of Science and Technology",
          contactEmail: "science@university.com",
          contactPhone: "+1234567890",
        },
        {
          name: "Faculty of Arts",
          code: "ART",
          description: "Faculty of Arts and Humanities",
          contactEmail: "arts@university.com",
          contactPhone: "+1234567891",
        },
        {
          name: "Faculty of Engineering",
          code: "ENG",
          description: "Faculty of Engineering",
          contactEmail: "engineering@university.com",
          contactPhone: "+1234567892",
        },
        {
          name: "Faculty of Business",
          code: "BUS",
          description: "Faculty of Business Administration",
          contactEmail: "business@university.com",
          contactPhone: "+1234567893",
        },
        {
          name: "Faculty of Medicine",
          code: "MED",
          description: "Faculty of Medicine and Health Sciences",
          contactEmail: "medicine@university.com",
          contactPhone: "+1234567894",
        },
      ]

      console.log("Creating faculties...")
      let facultiesCreated = 0
      for (const faculty of faculties) {
        try {
          const response = await api.post("/faculty/", faculty)
          console.log(`Faculty ${faculty.name} created:`, response.data)
          facultiesCreated++
        } catch (error) {
          console.log(`Faculty ${faculty.name} error:`, error.response?.data)
          if (error.response?.status !== 409) {
            // Don't count conflicts as errors
            throw error
          }
        }
      }

      // Wait a bit before creating departments
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create sample departments
      const departments = [
        // Science Faculty
        {
          name: "Computer Science",
          code: "CSC",
          description: "Department of Computer Science",
          faculty: "Faculty of Science",
        },
        {
          name: "Mathematics",
          code: "MTH",
          description: "Department of Mathematics",
          faculty: "Faculty of Science",
        },
        {
          name: "Physics",
          code: "PHY",
          description: "Department of Physics",
          faculty: "Faculty of Science",
        },
        {
          name: "Chemistry",
          code: "CHM",
          description: "Department of Chemistry",
          faculty: "Faculty of Science",
        },
        // Arts Faculty
        {
          name: "English Literature",
          code: "ENG",
          description: "Department of English Literature",
          faculty: "Faculty of Arts",
        },
        {
          name: "History",
          code: "HIS",
          description: "Department of History",
          faculty: "Faculty of Arts",
        },
        {
          name: "Philosophy",
          code: "PHI",
          description: "Department of Philosophy",
          faculty: "Faculty of Arts",
        },
        // Engineering Faculty
        {
          name: "Civil Engineering",
          code: "CVE",
          description: "Department of Civil Engineering",
          faculty: "Faculty of Engineering",
        },
        {
          name: "Electrical Engineering",
          code: "EEE",
          description: "Department of Electrical Engineering",
          faculty: "Faculty of Engineering",
        },
        {
          name: "Mechanical Engineering",
          code: "MEE",
          description: "Department of Mechanical Engineering",
          faculty: "Faculty of Engineering",
        },
        // Business Faculty
        {
          name: "Business Administration",
          code: "BBA",
          description: "Department of Business Administration",
          faculty: "Faculty of Business",
        },
        {
          name: "Accounting",
          code: "ACC",
          description: "Department of Accounting",
          faculty: "Faculty of Business",
        },
        // Medicine Faculty
        {
          name: "Medicine",
          code: "MED",
          description: "Department of Medicine",
          faculty: "Faculty of Medicine",
        },
        {
          name: "Nursing",
          code: "NUR",
          description: "Department of Nursing",
          faculty: "Faculty of Medicine",
        },
      ]

      console.log("Creating departments...")
      let departmentsCreated = 0
      for (const department of departments) {
        try {
          const response = await api.post("/department/", department)
          console.log(`Department ${department.name} created:`, response.data)
          departmentsCreated++
        } catch (error) {
          console.log(`Department ${department.name} error:`, error.response?.data)
          if (error.response?.status !== 409) {
            // Don't count conflicts as errors
            throw error
          }
        }
      }

      toast.success(`Sample data created! ${facultiesCreated} faculties and ${departmentsCreated} departments added.`)
      checkSystemStatus()
    } catch (error) {
      console.error("Error creating sample data:", error)
      toast.error("Failed to create sample data. Please try again.")
    }
    setLoading(false)
  }

  const isSystemEmpty = systemStatus.faculties === 0 && systemStatus.departments === 0 && systemStatus.users === 0

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">System Setup</h1>
          <p className="text-gray-600">Initialize your Student Management System</p>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current state of your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{systemStatus.faculties}</div>
                <div className="text-sm text-blue-800">Faculties</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{systemStatus.departments}</div>
                <div className="text-sm text-green-800">Departments</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{systemStatus.users}</div>
                <div className="text-sm text-purple-800">Users</div>
              </div>
            </div>
            {isSystemEmpty && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Empty Database Detected:</strong> Your system appears to be new. Use the quick setup below to
                  get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Setup */}
        <div className="text-center">
          <Button onClick={createSampleData} disabled={loading} size="lg" className="mb-4">
            {loading ? "Creating..." : "🚀 Quick Setup - Create Sample Data"}
          </Button>
          <p className="text-sm text-gray-500">
            This will create 5 faculties and 14 departments to get you started quickly
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={checkSystemStatus} disabled={loading} size="sm">
              🔄 Refresh Status
            </Button>
          </div>
        </div>

        {/* Manual Creation Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Faculty Manually</CardTitle>
              <CardDescription>Add a new faculty to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFaculty} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                  <Input
                    name="name"
                    required
                    value={facultyData.name}
                    onChange={handleFacultyChange}
                    placeholder="e.g., Faculty of Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Code</label>
                  <Input
                    name="code"
                    required
                    value={facultyData.code}
                    onChange={handleFacultyChange}
                    placeholder="e.g., SCI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <Input
                    name="contactEmail"
                    type="email"
                    required
                    value={facultyData.contactEmail}
                    onChange={handleFacultyChange}
                    placeholder="faculty@university.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <Input
                    name="contactPhone"
                    required
                    value={facultyData.contactPhone}
                    onChange={handleFacultyChange}
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={facultyData.description}
                    onChange={handleFacultyChange}
                    placeholder="Faculty description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Faculty"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Department Manually</CardTitle>
              <CardDescription>Add a new department to a faculty</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                  <Input
                    name="name"
                    required
                    value={departmentData.name}
                    onChange={handleDepartmentChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                  <Input
                    name="code"
                    required
                    value={departmentData.code}
                    onChange={handleDepartmentChange}
                    placeholder="e.g., CSC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                  <Input
                    name="faculty"
                    required
                    value={departmentData.faculty}
                    onChange={handleDepartmentChange}
                    placeholder="e.g., Faculty of Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={departmentData.description}
                    onChange={handleDepartmentChange}
                    placeholder="Department description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <Button type="submit" disabled={loading || systemStatus.faculties === 0} className="w-full">
                  {loading ? "Creating..." : "Create Department"}
                </Button>
                {systemStatus.faculties === 0 && (
                  <p className="text-sm text-amber-600">Create at least one faculty first</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>What to do after setting up faculties and departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    systemStatus.faculties > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {systemStatus.faculties > 0 ? "✓" : "1"}
                </div>
                <span className={systemStatus.faculties > 0 ? "text-green-800" : "text-gray-600"}>
                  Create Faculties ({systemStatus.faculties} created)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    systemStatus.departments > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {systemStatus.departments > 0 ? "✓" : "2"}
                </div>
                <span className={systemStatus.departments > 0 ? "text-green-800" : "text-gray-600"}>
                  Create Departments ({systemStatus.departments} created)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    systemStatus.users > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {systemStatus.users > 0 ? "✓" : "3"}
                </div>
                <span className={systemStatus.users > 0 ? "text-green-800" : "text-gray-600"}>
                  Register Admin User ({systemStatus.users} users)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <span className="text-gray-600">Start using the system</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              {systemStatus.faculties > 0 && systemStatus.departments > 0 && (
                <Button onClick={() => (window.location.href = "/register")} variant="outline">
                  👤 Register Admin User
                </Button>
              )}
              {systemStatus.users > 0 && (
                <Button onClick={() => (window.location.href = "/login")}>🚀 Go to Login</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
