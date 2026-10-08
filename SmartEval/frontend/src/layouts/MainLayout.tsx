import { Outlet, Link, useLocation } from "react-router-dom"
import { BookOpen, LayoutDashboard, FileText, BarChart2, Settings, User } from "lucide-react"
import { cn } from "../lib/utils"

export default function MainLayout() {
  const location = useLocation()
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Exams", path: "/exams", icon: BookOpen },
    { name: "Results", path: "/results", icon: FileText },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 text-primary-700">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold tracking-tight">SmartEval</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-gray-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Teacher Demo</span>
              <span className="text-xs text-gray-500">Teacher</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FB]">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center w-96">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input type="search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-200 rounded-full bg-gray-50 focus:ring-primary-500 focus:border-primary-500" placeholder="Search exams, students..." />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"/>
              </svg>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                T
              </div>
              <span className="text-sm font-medium text-gray-700">Teacher Demo</span>
              <svg className="w-3 h-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
