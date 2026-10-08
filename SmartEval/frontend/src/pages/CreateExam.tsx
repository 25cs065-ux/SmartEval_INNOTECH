import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createExam } from "../services/api"
import { toast } from "sonner"
import { ArrowRight, ChevronDown, Clock, CalendarIcon } from "lucide-react"

export default function CreateExam() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    exam_code: "",
    exam_date: "",
    academic_year: "",
    duration: 120,
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const exam = await createExam(formData)
      toast.success("Exam created successfully")
      navigate(`/exams/${exam.id}`)
    } catch (error) {
      toast.error("Failed to create exam")
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Exam</h1>
        <p className="text-gray-500 mt-2 text-sm">Fill in the details to create a new examination.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Wizard Steps */}
        <div className="flex justify-between items-center mb-10 px-4 md:px-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary-200">1</div>
            <span className="font-semibold text-gray-900">Exam Details</span>
          </div>
          <div className="h-px bg-gray-200 flex-1 mx-4 md:mx-8"></div>
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
            <span className="font-semibold text-gray-600">Questions</span>
          </div>
          <div className="h-px bg-gray-200 flex-1 mx-4 md:mx-8"></div>
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
            <span className="font-semibold text-gray-600">Review</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Exam Name <span className="text-red-500">*</span></label>
              <input 
                required 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. CIE 2" 
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Exam Code <span className="text-red-500">*</span></label>
              <input 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                value={formData.exam_code}
                onChange={e => setFormData({...formData, exam_code: e.target.value})}
                placeholder="e.g. CS101" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Subject <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white appearance-none"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g. Computer Networks" 
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Duration (minutes) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white pl-10"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                />
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Exam Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="date"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white pl-10"
                  value={formData.exam_date}
                  onChange={e => setFormData({...formData, exam_date: e.target.value})}
                />
                <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <span className="text-xs text-gray-400">{formData.description.length}/500</span>
            </div>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white resize-none"
              value={formData.description}
              maxLength={500}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Optional description..." 
            />
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100 flex justify-between items-center">
            <button 
              type="button" 
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md shadow-primary-200 hover:shadow-lg active:scale-95"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
