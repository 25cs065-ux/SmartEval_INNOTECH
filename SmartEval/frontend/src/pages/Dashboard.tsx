import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getExams, type Exam } from "../services/api"
import { Button } from "../components/ui/Button"
import { Users, FileText, CheckCircle, BarChart2, Plus, ArrowRight, Calendar, TrendingUp, BookOpen, Clock } from "lucide-react"

export default function Dashboard() {
  const [exams, setExams] = useState<Exam[]>([])
  const [stats, setStats] = useState({
    total_exams: 0,
    papers_evaluated: 0,
    students_evaluated: 0,
    average_score: 0
  })
  
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    
    import("../services/api").then(({ api }) => {
      api.get("/exams/dashboard-stats").then(res => setStats(res.data)).catch(console.error)
    })
    getExams().then(setExams).catch(console.error)
    
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Good Morning, Teacher <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">AI-assisted evaluation powered by teacher-defined marking schemes.</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div className="font-medium text-gray-700">{formatDate(currentTime)}</div>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-gray-300">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Total Exams</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-gray-900">{stats.total_exams}</div>
              <div className="flex items-center text-emerald-500 text-sm font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                25%
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-gray-300">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Papers Evaluated</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-gray-900">{stats.papers_evaluated}</div>
              <div className="flex items-center text-emerald-500 text-sm font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                33%
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-gray-300">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Students Evaluated</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-gray-900">{stats.students_evaluated}</div>
              <div className="flex items-center text-emerald-500 text-sm font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                33%
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-gray-300">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Average Score</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-gray-900">{stats.average_score.toFixed(1)}%</div>
              <div className="flex items-center text-emerald-500 text-sm font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                8.2%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Exam Banner */}
      <div className="bg-gradient-to-r from-primary-50 to-white border border-primary-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-200/50">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Create New Exam</h3>
            <p className="text-sm text-gray-600 mt-1">Set up a new exam with questions and marking scheme.</p>
          </div>
        </div>
        <Link to="/exams/create">
          <button className="w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center text-white transition-all shadow-md shadow-primary-200 hover:scale-105 active:scale-95">
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Recent Exams</h2>
          <Link to="/exams" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {exams.slice(0, 5).map(exam => (
            <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow hover:border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{exam.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{exam.subject}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider font-bold rounded-full shrink-0">
                  Evaluated
                </span>
              </div>
              
              <div className="space-y-2.5 mt-1 mb-6 flex-1">
                <div className="flex items-center text-xs text-gray-500 font-medium gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {exam.exam_date || 'N/A'}
                </div>
                <div className="flex items-center text-xs text-gray-500 font-medium gap-2.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Marks: {exam.total_marks || 0}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700 z-20">T</div>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700 z-10">S</div>
                  <div className="w-7 h-7 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-700 z-0">M</div>
                </div>
                <Link to={`/exams/${exam.id}`} className="text-sm font-semibold text-gray-700 hover:text-primary-600 flex items-center gap-1.5 transition-colors">
                  Open Exam <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
          
          {/* AI Evaluation In Progress Placeholder Card (matches mockup) */}
          {exams.length > 0 && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-5 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-400"></div>
              <div className="flex justify-between items-start mb-4 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">AI Evaluation in Progress</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Processing 3 answer sheets · 2 more to go</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <div className="flex justify-between text-xs font-bold text-primary-700 mb-2">
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          )}

          {exams.length === 0 && (
            <div className="col-span-full p-12 text-center flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No exams created yet</h3>
              <p className="text-sm">Click "Create New Exam" above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
