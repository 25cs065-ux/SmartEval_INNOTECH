import { useState, useEffect } from "react"
import { getExams, type Exam, api } from "../services/api"
import { Link } from "react-router-dom"
import { Card, CardContent } from "../components/ui/Card"
import { FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

export default function Results() {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    getExams().then(data => {
      setExams(data)
      if (data.length > 0) {
        setSelectedExamId(data[0].id)
      }
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedExamId) {
      api.get(`/submissions/exam/${selectedExamId}`).then(res => {
        setSubmissions(res.data)
      }).catch(console.error)
    }
  }, [selectedExamId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Evaluation Results</h1>
          <p className="text-gray-500 mt-1">Review AI evaluations and student answer sheets.</p>
        </div>
        <select 
          className="border p-2 rounded-md bg-white"
          value={selectedExamId || ""}
          onChange={e => setSelectedExamId(parseInt(e.target.value))}
        >
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>{exam.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FileText className="w-12 h-12 mb-4 text-gray-300" />
            <p>No answer sheets have been uploaded for this exam yet.</p>
            <Link to={`/exams/${selectedExamId}`} className="text-primary-600 font-medium mt-2 hover:underline">
              Go to Exam Details to upload papers
            </Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-600">Student</th>
                <th className="p-4 font-semibold text-gray-600">Upload Date</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Score</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub: any) => (
                <tr key={sub.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{sub.student_name}</div>
                    <div className="text-xs text-gray-500">{sub.student_roll_number}</div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(sub.uploaded_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {sub.submission_status === 'completed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated
                      </span>
                    ) : sub.submission_status === 'error' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3.5 h-3.5" /> Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3.5 h-3.5" /> Processing
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {sub.submission_status === 'completed' ? (
                      <div className="font-bold text-gray-900">
                        {sub.obtained_marks} <span className="text-gray-400 font-normal text-sm">/ {sub.total_marks}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/results/${sub.id}`} className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                      View Result
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
