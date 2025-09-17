import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, GraduationCap, Building, TrendingUp, Clock } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalLecturers: 0,
    totalFaculties: 0,
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [studentsRes, coursesRes, lecturersRes, facultiesRes] = await Promise.allSettled([
        api.get("/auth/all"),
        api.get("/course/all"),
        api.get("/lecturer/"),
        api.get("/faculty/all"),
      ])

      const studentsData = studentsRes.status === "fulfilled" ? studentsRes.value.data.data : []
      const coursesData = coursesRes.status === "fulfilled" ? coursesRes.value.data.courses : []
      const lecturersData = lecturersRes.status === "fulfilled" ? lecturersRes.value.data.lecturers : []
      const facultiesData = facultiesRes.status === "fulfilled" ? facultiesRes.value.data : []

      setStats({
        totalStudents: Array.isArray(studentsData) ? studentsData.length : 0,
        totalCourses: Array.isArray(coursesData) ? coursesData.length : 0,
        totalLecturers: Array.isArray(lecturersData) ? lecturersData.length : 0,
        totalFaculties: Array.isArray(facultiesData) ? facultiesData.length : 0,
      })

      setRecentCourses(Array.isArray(coursesData) ? coursesData.slice(0, 5) : [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setStats({
        totalStudents: 0,
        totalCourses: 0,
        totalLecturers: 0,
        totalFaculties: 0,
      })
      setRecentCourses([])
    } finally {
      setLoading(false)
    }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case "view-courses":
      case "enroll-course":
      case "create-course":
      case "my-courses":
        navigate("/courses")
        break
      case "manage-students":
      case "student-list":
        navigate("/students")
        break
      case "manage-lecturers":
        navigate("/lecturers")
        break
      case "manage-faculties":
        navigate("/faculties")
        break
      case "manage-departments":
        navigate("/departments")
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {getWelcomeMessage()}, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">Welcome to your {user?.role} dashboard</p>
      </div>

      {/* Stats Cards - Admin Only */}
      {user?.role === "Admin" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/students")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Total enrolled
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/courses")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Available courses
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/lecturers")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecturers</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLecturers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Active faculty
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/faculties")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFaculties}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Academic units
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Courses</span>
            </CardTitle>
            <CardDescription>Latest courses in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(recentCourses) && recentCourses.length > 0 ? (
              <div className="space-y-3">
                {recentCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors space-y-2 sm:space-y-0"
                    onClick={() => navigate("/courses")}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm sm:text-base">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.code} • {course.unit} units
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground self-start sm:self-center">{course.semester}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/courses")} className="w-full">
                    View All Courses
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">No courses available</p>
                {(user?.role === "Admin" || user?.role === "Lecturer") && (
                  <Button onClick={() => navigate("/courses")}>Create First Course</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {user?.role === "student" && (
                <>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => handleQuickAction("view-courses")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">View My Courses</div>
                        <div className="text-sm text-muted-foreground">Check your enrolled courses</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => handleQuickAction("enroll-course")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Enroll in Course</div>
                        <div className="text-sm text-muted-foreground">Register for new courses</div>
                      </div>
                    </div>
                  </Button>
                </>
              )}

              {user?.role === "Admin" && (
                <>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => handleQuickAction("manage-students")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Manage Students</div>
                        <div className="text-sm text-muted-foreground">View and manage student records</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => handleQuickAction("create-course")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Create Course</div>
                        <div className="text-sm text-muted-foreground">Add new courses to the system</div>
                      </div>
                    </div>
                  </Button>
                </>
              )}

              {user?.role === "Lecturer" && (
                <>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => handleQuickAction("my-courses")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                        <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">My Courses</div>
                        <div className="text-sm text-muted-foreground">View courses you're teaching</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => handleQuickAction("student-list")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                        <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Student List</div>
                        <div className="text-sm text-muted-foreground">View enrolled students</div>
                      </div>
                    </div>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Information Card */}
      {user?.regNo && (
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                <p className="font-mono text-lg">{user.regNo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="break-all">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
