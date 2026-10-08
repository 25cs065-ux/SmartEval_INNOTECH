import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getExam, type Exam, getQuestions, type Question, getSubmissions, type Submission } from "../services/api"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { FileText, Users, BarChart, Settings, Upload, CheckCircle, AlertCircle } from "lucide-react"
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

  if (!exam) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-primary-600 font-medium mb-1">{exam.subject}</div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{exam.name}</h1>
          <div className="text-gray-500 mt-2 flex gap-4 text-sm">
            <span>Date: {exam.exam_date || 'N/A'}</span>
            <span>Total Marks: {exam.total_marks || 0}</span>
            <span>Questions: {questions.length}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("marking_scheme")}>
            <Settings className="w-4 h-4 mr-2" /> Marking Scheme
          </Button>
          <Button onClick={() => setActiveTab("evaluate")}>
            <Upload className="w-4 h-4 mr-2" /> Evaluate Answer Sheet
          </Button>
        </div>
      </div>

      <div className="flex border-b">
        {["overview", "marking_scheme", "evaluate", "results"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? "border-primary-600 text-primary-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Students Evaluated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissions.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {submissions.length > 0 && submissions.some(s => s.percentage != null) 
                      ? Math.round(submissions.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / submissions.filter(s => s.percentage != null).length) + '%'
                      : 'N/A'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Marking Scheme Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {questions.length > 0 ? (
                      <><CheckCircle className="text-green-500 h-6 w-6" /> Defined</>
                    ) : (
                      <><AlertCircle className="text-amber-500 h-6 w-6" /> Pending</>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No submissions yet.</div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map(sub => (
                      <div key={sub.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="font-medium">{sub.student_name}</div>
                          <div className="text-sm text-gray-500">{sub.student_roll_number}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-bold">{sub.obtained_marks !== null ? `${sub.obtained_marks} / ${sub.total_marks}` : 'Processing...'}</div>
                          {/* We will add a view button later */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "marking_scheme" && (
          <MarkingSchemeBuilder examId={examId} initialQuestions={questions} onSave={loadData} />
        )}

        {activeTab === "evaluate" && (
          <EvaluateAnswerSheet exam={exam} onEvaluationComplete={loadData} />
        )}
        
        {activeTab === "results" && (
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Roll Number</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Percentage</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(sub => (
                      <tr key={sub.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{sub.student_name}</td>
                        <td className="px-4 py-3 text-gray-600">{sub.student_roll_number}</td>
                        <td className="px-4 py-3 font-bold">
                          {sub.obtained_marks !== null ? `${sub.obtained_marks} / ${sub.total_marks}` : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {sub.percentage != null ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.percentage >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {Math.round(sub.percentage)}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${sub.submission_status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {sub.submission_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link to={`/results/${sub.id}`}>
                            <Button variant="outline" size="sm">View Evaluation</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No results found. Upload and evaluate answer sheets first.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
