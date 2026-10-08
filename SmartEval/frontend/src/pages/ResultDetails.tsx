import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { type Submission, type QuestionEvaluation, getEvaluations, overrideEvaluation, getExam, type Exam } from "../services/api"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Edit3 } from "lucide-react"
import { toast } from "sonner"
// Note: We need a way to get a single submission. We'll add it to API soon or pass data differently. 
// For now, let's fetch exam + evaluations.

// Placeholder for full API call
import { api } from "../services/api"

export default function ResultDetails() {
  const { id } = useParams()
  const submissionId = parseInt(id || "0")
  
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [exam, setExam] = useState<Exam | null>(null)
  const [evaluations, setEvaluations] = useState<QuestionEvaluation[]>([])
  const [selectedEval, setSelectedEval] = useState<QuestionEvaluation | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [overrideMarks, setOverrideMarks] = useState<number>(0)
  const [overrideReason, setOverrideReason] = useState("")

  useEffect(() => {
    if (submissionId) {
      loadData()
    }
  }, [submissionId])

  const loadData = async () => {
    try {
      const subRes = await api.get(`/submissions/${submissionId}`)
      const subData = subRes.data
      setSubmission(subData)
      
      const examData = await getExam(subData.exam_id)
      setExam(examData)
      
      const evals = await getEvaluations(submissionId)
      setEvaluations(evals)
      if (evals.length > 0) {
        setSelectedEval(evals[0])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleOverride = async () => {
    if (!selectedEval) return
    try {
      await overrideEvaluation(selectedEval.id, { new_marks: overrideMarks, reason: overrideReason })
      toast.success("Marks updated successfully")
      setIsEditing(false)
      loadData()
    } catch (error) {
      toast.error("Failed to update marks")
    }
  }

  const handleReevaluate = async () => {
    toast.info("Starting AI Evaluation...")
    try {
      await api.post(`/submissions/${submissionId}/evaluate`)
      toast.success("Evaluation completed!")
      loadData()
    } catch (error) {
      toast.error("Evaluation failed again")
    }
  }

  if (!submission || !exam) return <div>Loading...</div>

  if (submission.submission_status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-800">Evaluation Failed</h2>
        <p className="text-gray-500 max-w-md">
          The AI encountered an error while evaluating this submission (e.g. Rate Limit exceeded).
        </p>
        <Button onClick={handleReevaluate} className="mt-4">
          Retry AI Evaluation
        </Button>
      </div>
    )
  }

  if (submission.submission_status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <h2 className="text-xl font-bold text-gray-800">Evaluating...</h2>
        <p className="text-gray-500 max-w-md">
          Please wait while the AI evaluates this submission.
        </p>
        <Button onClick={loadData} variant="outline" className="mt-4">
          Refresh Status
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col -m-8">
      {/* Header */}
      <div className="border-b bg-white p-4 px-8 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to={`/exams/${exam.id}`}>
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{exam.name}</div>
            <h1 className="text-xl font-bold text-gray-900">{submission.student_name} ({submission.student_roll_number})</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-gray-500">Final Score</div>
            <div className="text-2xl font-bold text-primary-700">
              {submission.obtained_marks} <span className="text-lg text-gray-400">/ {submission.total_marks}</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
            {Math.round(submission.percentage || 0)}%
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel - Question List */}
        <div className="w-72 border-r bg-gray-50 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b font-semibold text-sm text-gray-600 bg-white">
            Questions Pipeline
          </div>
          <div className="flex-1 p-2 space-y-2">
            {evaluations.map((ev, i) => {
              const isCorrect = ev.final_marks === ev.max_marks
              const isPartial = ev.final_marks > 0 && ev.final_marks < ev.max_marks
              const isWrong = ev.final_marks === 0
              const confPct = Math.round((ev.confidence || 0) * 100)
              
              return (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEval(ev)}
                  className={`w-full text-left px-3 py-3 rounded-md text-sm flex flex-col transition-colors border ${
                    selectedEval?.id === ev.id 
                      ? 'bg-primary-50 border-primary-200 text-primary-900 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-primary-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2 font-medium">
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {isPartial && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                      Question {i + 1}
                    </div>
                    <span className="font-mono font-bold">{ev.final_marks}/{ev.max_marks}</span>
                  </div>
                  
                  <div className="w-full flex items-center justify-between text-xs text-gray-500">
                    <span>AI Confidence</span>
                    <span className={confPct >= 80 ? 'text-green-600 font-medium' : confPct >= 50 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'}>
                      {confPct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${confPct >= 80 ? 'bg-green-500' : confPct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${confPct}%` }}
                    ></div>
                  </div>
                  {ev.feedback && (
                    <p className="w-full mt-2 text-xs text-gray-500 italic line-clamp-2 leading-tight">
                      "{ev.feedback}"
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Center Panel - Answer Sheet Viewer */}
        <div className="flex-1 bg-gray-200 overflow-auto relative flex justify-center p-8">
          {/* This is where Konva would go to draw bounding boxes. We simulate it for now with an image */}
          <div className="bg-white shadow-lg relative overflow-hidden flex flex-col" style={{ width: '800px', minHeight: '1100px' }}>
             
             {submission.original_file_url ? (
               submission.original_file_url.toLowerCase().endsWith('.pdf') ? (
                 <iframe
                   src={`http://localhost:8000/${submission.original_file_url.replace(/\\/g, '/')}`}
                   title="Student Answer Sheet"
                   className="w-full h-full flex-1 border-0"
                 />
               ) : (
                 <img 
                   src={`http://localhost:8000/${submission.original_file_url.replace(/\\/g, '/')}`} 
                   alt="Student Answer Sheet" 
                   className="w-full h-auto object-contain"
                 />
               )
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <p>Original Handwritten Answer Sheet View</p>
                  <p className="text-xs mt-2">(Rendered here via react-konva for annotations)</p>
               </div>
             )}
             
             {/* Simulated Annotation box for selected question */}
             {selectedEval && (
                <div className="absolute top-32 left-10 w-[700px] h-[300px] border-4 rounded bg-transparent transition-colors z-10 
                  ${selectedEval.final_marks === selectedEval.max_marks ? 'border-green-500 bg-green-500/10' : 
                    selectedEval.final_marks === 0 ? 'border-red-500 bg-red-500/10' : 'border-amber-500 bg-amber-500/10'}"
                >
                  <div className={`absolute -top-8 right-0 px-3 py-1 rounded text-white font-bold text-sm
                    ${selectedEval.final_marks === selectedEval.max_marks ? 'bg-green-500' : 
                    selectedEval.final_marks === 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                  >
                    AI: {selectedEval.final_marks}/{selectedEval.max_marks}
                  </div>
                </div>
             )}
          </div>
        </div>

        {/* Right Panel - Evaluation Details */}
        <div className="w-96 border-l bg-white overflow-y-auto shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 flex flex-col">
          {selectedEval ? (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">AI Evaluation</h3>
                  <p className="text-sm text-gray-500">Confidence: {(selectedEval.confidence * 100).toFixed(0)}%</p>
                </div>
                <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${
                  selectedEval.final_marks === selectedEval.max_marks ? 'bg-green-100 text-green-700' : 
                  selectedEval.final_marks === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedEval.final_marks}/{selectedEval.max_marks}
                </div>
              </div>

              {isEditing ? (
                <Card className="border-primary-200 shadow-sm bg-primary-50/50">
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-semibold text-primary-900 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> Teacher Override
                    </h4>
                    <div>
                      <label className="text-sm font-medium">New Marks</label>
                      <input 
                        type="number" 
                        max={selectedEval.max_marks}
                        min={0}
                        step={0.5}
                        className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-primary-500 outline-none"
                        value={overrideMarks} 
                        onChange={e => setOverrideMarks(parseFloat(e.target.value))} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reason (Optional)</label>
                      <textarea 
                        className="w-full mt-1 p-2 border rounded min-h-[80px] focus:ring-2 focus:ring-primary-500 outline-none"
                        value={overrideReason} 
                        onChange={e => setOverrideReason(e.target.value)} 
                        placeholder="Why are you changing these marks?"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleOverride} className="w-full">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="w-full">Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => {
                  setIsEditing(true); 
                  setOverrideMarks(selectedEval.final_marks);
                  setOverrideReason("");
                }}>
                  <Edit3 className="w-4 h-4 mr-2" /> Override Marks
                </Button>
              )}

              <div className="space-y-4">
                {selectedEval.matched_concepts && selectedEval.matched_concepts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Matched Concepts
                    </h4>
                    <ul className="text-sm space-y-1">
                      {selectedEval.matched_concepts.map((c, idx) => (
                        <li key={idx} className="flex gap-2 text-gray-700">
                          <span className="text-green-500 mt-0.5">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEval.missing_concepts && selectedEval.missing_concepts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Missing Concepts
                    </h4>
                    <ul className="text-sm space-y-1">
                      {selectedEval.missing_concepts.map((c, idx) => (
                        <li key={idx} className="flex gap-2 text-gray-700">
                          <span className="text-red-500 mt-0.5">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">AI Feedback</h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                  {selectedEval.feedback || "No specific feedback provided."}
                </div>
              </div>
              
              {selectedEval.rubric_breakdown && selectedEval.rubric_breakdown.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Rubric Breakdown</h4>
                  <div className="space-y-2">
                    {selectedEval.rubric_breakdown.map((r: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <span className="text-gray-700 truncate mr-2" title={r.criterion}>{r.criterion}</span>
                        <span className="font-mono font-medium shrink-0">{r.awarded_marks}/{r.max_marks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select a question from the left panel to view its evaluation.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
