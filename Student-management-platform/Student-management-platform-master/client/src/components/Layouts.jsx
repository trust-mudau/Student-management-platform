import { Outlet, Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeToggle from "./ThemeToggle"
import { Menu, X, Home, BookOpen, Users, GraduationCap, Building, Building2 } from "lucide-react"
import { useState } from "react"

export default function Layout() {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      roles: ["student", "Admin", "Lecturer"],
      icon: Home,
    },
    {
      name: "Courses",
      href: "/courses",
      roles: ["student", "Admin", "Lecturer"],
      icon: BookOpen,
    },
    {
      name: "Students",
      href: "/students",
      roles: ["Admin", "Lecturer"],
      icon: Users,
    },
    {
      name: "Lecturers",
      href: "/lecturers",
      roles: ["Admin"],
      icon: GraduationCap,
    },
    {
      name: "Faculties",
      href: "/faculties",
      roles: ["Admin"],
      icon: Building,
    },
    {
      name: "Departments",
      href: "/departments",
      roles: ["Admin"],
      icon: Building2,
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role || "student"))

  const NavLink = ({ item, mobile = false }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.href

    return (
      <Link
        to={item.href}
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        } ${mobile ? "w-full" : ""}`}
      >
        <Icon className="h-4 w-4" />
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="px-3">
                      <h2 className="text-lg font-semibold">Navigation</h2>
                    </div>
                    {filteredNavigation.map((item) => (
                      <NavLink key={item.name} item={item} mobile />
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-semibold hidden sm:block">Student Management</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {filteredNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>

            {/* User Menu and Theme Toggle */}
            <div className="flex items-center space-x-2">
              <ThemeToggle size="sm" />

              {/* User Info - Hidden on small screens */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={logout}>
                <span className="hidden sm:inline">Logout</span>
                <X className="h-4 w-4 sm:hidden" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
