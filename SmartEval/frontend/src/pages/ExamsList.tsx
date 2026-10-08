import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getExams, type Exam } from "../services/api"
import { Plus, Search, Calendar, FileText, ArrowRight, BookOpen } from "lucide-react"

export default function ExamsList() {
  const [exams, setExams] = useState<Exam[]>([])
  
  useEffect(() => {
    getExams().then(setExams).catch(console.error)
  }, [])

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            All Exams
          </h1>
          <p className="text-[#64748B] mt-1.5 text-sm font-medium">Manage your created exams, student submissions, and marking schemes.</p>
        </div>
        <Link to="/exams/create">
          <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-primary-200 hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" />
            Create New Exam
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex items-center p-2 pl-4">
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search exams by name, code, or subject..." 
          className="flex-1 py-2.5 outline-none text-[#0F172A] placeholder:text-gray-400 font-medium"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 flex flex-col hover:shadow-md transition-all hover:border-primary-200 group">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-bold text-[#0F172A] text-lg line-clamp-1">{exam.name}</h3>
                <p className="text-[14px] text-[#64748B] mt-1 font-medium">{exam.subject}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-3 mt-2 mb-6 flex-1 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500 font-medium">Code</span>
                <span className="font-bold text-[#0F172A]">{exam.exam_code || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary-500" />
                  {exam.exam_date || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500 font-medium">Total Marks</span>
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  {exam.total_marks || 0}
                </span>
              </div>
            </div>
            
            <Link to={`/exams/${exam.id}`} className="block">
              <button className="w-full py-2.5 bg-gray-50 hover:bg-primary-50 text-[#0F172A] hover:text-primary-700 font-bold rounded-xl transition-colors border border-gray-200 hover:border-primary-200 flex items-center justify-center gap-2">
                Manage Exam <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        ))}

        {exams.length === 0 && (
          <div className="col-span-full p-16 text-center flex flex-col items-center justify-center text-[#64748B] bg-white rounded-[20px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No exams created yet</h3>
            <p className="text-[15px] max-w-sm">You haven't created any exams. Click the button above to set up your first marking scheme.</p>
          </div>
        )}
      </div>
    </div>
  )
}
