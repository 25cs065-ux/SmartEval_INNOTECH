import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, FileText, BarChart2, Settings, User, Bell, Search, ChevronDown, Layers, BookOpen } from "lucide-react"
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
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-full shrink-0 z-20">
        <div className="p-6 pb-8">
          <div className="flex items-center gap-3 text-primary-700">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-primary-500/30">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">SmartEval</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  isActive 
                    ? "bg-primary-50 text-primary-700 shadow-sm shadow-primary-100/50" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-gray-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">Teacher Demo</span>
                <span className="text-xs text-gray-500">Teacher</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-[72px] bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0 sticky top-0 border-b border-transparent">
          <div className="flex items-center w-96">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="search" 
                className="block w-full py-2.5 pl-11 pr-4 text-sm text-gray-900 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                placeholder="Search exams, students..." 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 relative transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
            <div className="flex items-center gap-3 cursor-pointer pl-6 border-l border-gray-200">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-primary-200">
                T
              </div>
              <span className="text-sm font-bold text-gray-700">Teacher Demo</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
