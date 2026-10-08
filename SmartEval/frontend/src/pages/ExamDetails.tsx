import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getExam, type Exam, getQuestions, type Question, getSubmissions, type Submission } from "../services/api"
import { FileText, Users, BarChart2, Settings, Upload, CheckCircle2, AlertCircle, Calendar, ArrowRight, Eye } from "lucide-react"
import MarkingSchemeBuilder from "../components/MarkingSchemeBuilder"
import EvaluateAnswerSheet from "../components/EvaluateAnswerSheet"

export default function ExamDetails() {
  const { id } = useParams()
  const examId = parseInt(id || "0")
  
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (examId) {
      loadData()
    }
  }, [examId])

  const loadData = async () => {
    try {
      const [e, q, s] = await Promise.all([
        getExam(examId),
        getQuestions(examId),
        getSubmissions(examId)
      ])
      setExam(e)
      setQuestions(q)
      setSubmissions(s)
    } catch (error) {
      console.error(error)
    }
  }

  if (!exam) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading exam details...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm font-semibold text-primary-600 mb-1 flex items-center gap-2">
            <span className="bg-primary-50 px-2 py-0.5 rounded-md">{exam.exam_code || 'EXAM'}</span>
            {exam.subject}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{exam.name}</h1>
          <div className="text-gray-500 mt-2 flex items-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> {exam.exam_date || 'No date set'}</span>
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-gray-400" /> {exam.total_marks || 0} Marks</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-gray-400" /> {questions.length} Questions</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab("marking_scheme")}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Marking Scheme
          </button>
          <button 
            onClick={() => setActiveTab("evaluate")}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm shadow-primary-200"
          >
            <Upload className="w-4 h-4" /> Evaluate Papers
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {["overview", "marking_scheme", "evaluate", "results"].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                isActive 
                  ? "border-primary-600 text-primary-700 bg-primary-50/30" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
              }`}
            >
              {tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-indigo-50 rounded-xl">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <BarChart2 className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Students Evaluated</div>
                  <div className="text-3xl font-bold text-gray-900">{submissions.length}</div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-emerald-50 rounded-xl">
                    <BarChart2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <BarChart2 className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Average Score</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {submissions.length > 0 && submissions.some(s => s.percentage != null) 
                      ? Math.round(submissions.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / submissions.filter(s => s.percentage != null).length) + '%'
                      : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${questions.length > 0 ? 'bg-blue-50' : 'bg-amber-50'}`}>
                    {questions.length > 0 ? <CheckCircle2 className="w-5 h-5 text-blue-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Marking Scheme</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {questions.length > 0 ? 'Defined' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Evaluations */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Evaluations</h3>
                <button onClick={() => setActiveTab('results')} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {submissions.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center text-gray-500">
                    <FileText className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="font-medium">No submissions yet.</p>
                    <p className="text-sm mt-1">Upload an answer sheet to begin evaluation.</p>
                  </div>
                ) : (
                  submissions.slice(0, 5).map(sub => (
                    <div key={sub.id} className="flex justify-between items-center p-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                          {sub.student_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{sub.student_name}</div>
                          <div className="text-sm font-medium text-gray-500">{sub.student_roll_number}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {sub.obtained_marks !== null ? `${sub.obtained_marks} / ${sub.total_marks}` : 'Processing...'}
                          </div>
                          {sub.percentage != null && (
                            <div className="text-xs font-semibold text-emerald-600">{Math.round(sub.percentage)}%</div>
                          )}
                        </div>
                        <Link to={`/results/${sub.id}`}>
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "marking_scheme" && (
          <MarkingSchemeBuilder examId={examId} initialQuestions={questions} onSave={loadData} />
        )}

        {activeTab === "evaluate" && (
          <EvaluateAnswerSheet exam={exam} onEvaluationComplete={loadData} />
        )}
        
        {activeTab === "results" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <h3 className="font-bold text-gray-900">Student Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Roll Number</th>
                    <th className="px-6 py-4 font-semibold">Score</th>
                    <th className="px-6 py-4 font-semibold">Percentage</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{sub.student_name}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{sub.student_roll_number}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {sub.obtained_marks !== null ? `${sub.obtained_marks} / ${sub.total_marks}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {sub.percentage != null ? (
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${sub.percentage >= 40 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {Math.round(sub.percentage)}%
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${sub.submission_status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                          {sub.submission_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/results/${sub.id}`}>
                          <button className="px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                            View Result
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                        No results found. Upload and evaluate answer sheets first.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
