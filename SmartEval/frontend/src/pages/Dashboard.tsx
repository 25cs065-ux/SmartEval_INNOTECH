import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getExams, type Exam } from "../services/api"
import { Users, FileText, CheckCircle, BarChart2, ArrowRight, Calendar, TrendingUp, BookOpen, Clock, Activity, FileCheck2, Lightbulb } from "lucide-react"

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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            Good Morning, Teacher <span className="text-2xl animate-wave">👋</span>
          </h1>
          <p className="text-[#64748B] mt-1.5 text-sm font-medium">AI-assisted evaluation powered by teacher-defined marking schemes.</p>
        </div>
        <div className="text-right text-xs font-semibold text-[#64748B] flex flex-col items-end">
          <div className="text-primary-600 mb-0.5">{formatDate(currentTime)}</div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary-200 transition-colors">
          <div className="flex justify-between items-start mb-5">
            <div className="p-2.5 bg-blue-50/80 rounded-xl group-hover:bg-blue-100 transition-colors">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-gray-300 group-hover:text-primary-300 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#64748B] mb-1.5 tracking-wide">Total Exams</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-[#0F172A]">{stats.total_exams}</div>
              <div className="flex items-center text-emerald-500 text-xs font-bold mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                25%
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary-200 transition-colors">
          <div className="flex justify-between items-start mb-5">
            <div className="p-2.5 bg-emerald-50/80 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-gray-300 group-hover:text-primary-300 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#64748B] mb-1.5 tracking-wide">Papers Evaluated</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-[#0F172A]">{stats.papers_evaluated}</div>
              <div className="flex items-center text-emerald-500 text-xs font-bold mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                33%
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary-200 transition-colors">
          <div className="flex justify-between items-start mb-5">
            <div className="p-2.5 bg-indigo-50/80 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-gray-300 group-hover:text-primary-300 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#64748B] mb-1.5 tracking-wide">Students Evaluated</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-[#0F172A]">{stats.students_evaluated}</div>
              <div className="flex items-center text-emerald-500 text-xs font-bold mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                33%
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary-200 transition-colors">
          <div className="flex justify-between items-start mb-5">
            <div className="p-2.5 bg-primary-50/80 rounded-xl group-hover:bg-primary-100 transition-colors">
              <BarChart2 className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-gray-300 group-hover:text-primary-300 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#64748B] mb-1.5 tracking-wide">Average Score</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-[#0F172A]">{stats.average_score.toFixed(1)}%</div>
              <div className="flex items-center text-emerald-500 text-xs font-bold mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                8.2%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Exam Banner */}
      <Link to="/exams/create" className="block group">
        <div className="bg-gradient-to-r from-primary-50 to-white border border-primary-100 rounded-[20px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all group-hover:border-primary-300">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-primary-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0F172A]">Create New Exam</h3>
              <p className="text-sm font-medium text-[#64748B] mt-0.5">Set up a new exam with questions and marking scheme.</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white transition-all shadow-md shadow-primary-200 group-hover:translate-x-1">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#0F172A]">Recent Exams</h2>
          <Link to="/exams" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {exams.slice(0, 5).map(exam => (
            <div key={exam.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-all hover:border-gray-200 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base line-clamp-1">{exam.name}</h3>
                  <p className="text-[13px] text-[#64748B] mt-0.5 font-medium">{exam.subject}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] uppercase tracking-wider font-extrabold rounded-full shrink-0">
                  Evaluated
                </span>
              </div>
              
              <div className="space-y-3 mt-1 mb-6 flex-1 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                <div className="flex items-center text-[13px] text-[#64748B] font-medium gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {exam.exam_date || 'N/A'}
                </div>
                <div className="flex items-center text-[13px] text-[#64748B] font-medium gap-2.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Marks: {exam.total_marks || 0}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600 z-20">T</div>
                  <div className="w-7 h-7 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600 z-10">S</div>
                  <div className="w-7 h-7 rounded-full bg-purple-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-600 z-0">M</div>
                </div>
                <Link to={`/exams/${exam.id}`} className="text-[13px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 transition-all group-hover:gap-2">
                  Open Exam <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
          
          {/* AI Evaluation In Progress Placeholder Card */}
          {exams.length > 0 && (
            <div className="bg-white rounded-[20px] border border-primary-100 shadow-sm p-5 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400"></div>
              <div className="flex justify-between items-start mb-4 mt-2">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100/50">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-sm">AI Evaluation in Progress</h3>
                    <p className="text-[12px] text-[#64748B] mt-0.5 font-medium">Processing 3 answer sheets · 2 more to go</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-6">
                <div className="flex justify-end text-[11px] font-extrabold text-primary-600 mb-1.5 uppercase tracking-wider">
                  <span>75% Complete</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          )}

          {exams.length === 0 && (
            <div className="col-span-full p-12 text-center flex flex-col items-center justify-center text-[#64748B] bg-white rounded-[20px] border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">No exams created yet</h3>
              <p className="text-sm">Click "Create New Exam" above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
