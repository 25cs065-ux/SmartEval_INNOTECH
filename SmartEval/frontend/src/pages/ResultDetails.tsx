import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { type Submission, type QuestionEvaluation, getEvaluations, overrideEvaluation, getExam, type Exam } from "../services/api"
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Edit3, RefreshCw, FileImage, Sparkles, FileText } from "lucide-react"
import { toast } from "sonner"
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

  if (!submission || !exam) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading evaluation details...</div>

  if (submission.submission_status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Evaluation Failed</h2>
        <p className="text-gray-500 max-w-md text-sm">
          The AI encountered an error while evaluating this submission (e.g., Rate Limit exceeded or network failure).
        </p>
        <button 
          onClick={handleReevaluate} 
          className="mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retry AI Evaluation
        </button>
      </div>
    )
  }

  if (submission.submission_status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-2 shadow-inner">
          <Sparkles className="h-8 w-8 text-indigo-600 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Evaluating...</h2>
        <p className="text-gray-500 max-w-md text-sm">
          Please wait while the AI evaluates this submission.
        </p>
        <button 
          onClick={loadData} 
          className="mt-6 px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Refresh Status
        </button>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col -m-8">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4 px-8 flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center gap-5">
          <Link to={`/exams/${exam.id}`}>
            <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="text-xs text-primary-600 uppercase tracking-wider font-bold mb-0.5">{exam.name}</div>
            <h1 className="text-lg font-bold text-gray-900">{submission.student_name} <span className="text-gray-400 font-medium ml-1">({submission.student_roll_number})</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-gray-50 px-5 py-2 rounded-2xl border border-gray-100">
          <div className="text-right">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Final Score</div>
            <div className="text-xl font-bold text-gray-900">
              {submission.obtained_marks} <span className="text-sm font-medium text-gray-400">/ {submission.total_marks}</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner ${
            (submission.percentage || 0) >= 40 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {Math.round(submission.percentage || 0)}%
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        
        {/* Left Panel - Question List */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto shrink-0 flex flex-col z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="p-5 border-b border-gray-100 font-bold text-sm text-gray-900 bg-gray-50/50 flex items-center justify-between">
            Questions Pipeline
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{evaluations.length}</span>
          </div>
          <div className="flex-1 p-3 space-y-2">
            {evaluations.map((ev, i) => {
              const isCorrect = ev.final_marks === ev.max_marks
              const isPartial = ev.final_marks > 0 && ev.final_marks < ev.max_marks
              const isWrong = ev.final_marks === 0
              const confPct = Math.round((ev.confidence || 0) * 100)
              const isSelected = selectedEval?.id === ev.id
              
              return (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEval(ev)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm flex flex-col transition-all border ${
                    isSelected 
                      ? 'bg-primary-50 border-primary-200 shadow-sm ring-1 ring-primary-500/20' 
                      : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`flex items-center gap-2 font-bold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {isPartial && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                      Question {i + 1}
                    </div>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-md text-xs ${
                      isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ev.final_marks}/{ev.max_marks}
                    </span>
                  </div>
                  
                  <div className="w-full flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                    <span>AI Confidence</span>
                    <span className={confPct >= 80 ? 'text-emerald-600' : confPct >= 50 ? 'text-amber-600' : 'text-red-600'}>
                      {confPct}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isSelected ? 'bg-primary-200/50' : 'bg-gray-100'}`}>
                    <div 
                      className={`h-1.5 rounded-full ${confPct >= 80 ? 'bg-emerald-500' : confPct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${confPct}%` }}
                    ></div>
                  </div>
                  {ev.feedback && (
                    <p className={`w-full mt-3 text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-primary-800/80' : 'text-gray-500'}`}>
                      "{ev.feedback}"
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Center Panel - Answer Sheet Viewer */}
        <div className="flex-1 bg-gray-100/50 overflow-auto relative flex justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="bg-white shadow-xl shadow-gray-200/50 border border-gray-200 relative overflow-hidden flex flex-col rounded-sm" style={{ width: '800px', minHeight: '1100px' }}>
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
               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <FileImage className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="font-medium text-gray-500">Original Handwritten Answer Sheet View</p>
                  <p className="text-xs mt-1">(Rendered here via react-konva for annotations)</p>
               </div>
             )}
             
             {/* Simulated Annotation box for selected question */}
             {selectedEval && (
                <div className={`absolute top-32 left-10 w-[700px] h-[300px] border-4 rounded-lg bg-transparent transition-all z-10 shadow-lg 
                  ${selectedEval.final_marks === selectedEval.max_marks ? 'border-emerald-500 bg-emerald-500/5 shadow-emerald-500/20' : 
                    selectedEval.final_marks === 0 ? 'border-red-500 bg-red-500/5 shadow-red-500/20' : 'border-amber-500 bg-amber-500/5 shadow-amber-500/20'}`}
                >
                  <div className={`absolute -top-4 -left-1 px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-sm flex items-center gap-1.5
                    ${selectedEval.final_marks === selectedEval.max_marks ? 'bg-emerald-500' : 
                    selectedEval.final_marks === 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI: {selectedEval.final_marks}/{selectedEval.max_marks}
                  </div>
                </div>
             )}
          </div>
        </div>

        {/* Right Panel - Evaluation Details */}
        <div className="w-[400px] border-l border-gray-200 bg-white overflow-y-auto shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] z-10 flex flex-col">
          {selectedEval ? (
            <div className="p-6 space-y-8">
              <div className="flex justify-between items-start bg-indigo-50/50 p-5 -mx-6 -mt-6 border-b border-indigo-100">
                <div>
                  <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" /> AI Evaluation
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600/70">Confidence: {(selectedEval.confidence * 100).toFixed(0)}%</p>
                </div>
                <div className={`text-2xl font-bold px-4 py-1.5 rounded-xl shadow-inner border ${
                  selectedEval.final_marks === selectedEval.max_marks ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  selectedEval.final_marks === 0 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {selectedEval.final_marks}/{selectedEval.max_marks}
                </div>
              </div>

              {isEditing ? (
                <div className="bg-white border border-primary-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
                    <h4 className="font-bold text-primary-900 flex items-center gap-2 text-sm">
                      <Edit3 className="w-4 h-4" /> Teacher Override
                    </h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">New Marks</label>
                      <input 
                        type="number" 
                        max={selectedEval.max_marks}
                        min={0}
                        step={0.5}
                        className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-mono font-bold text-lg"
                        value={overrideMarks} 
                        onChange={e => setOverrideMarks(parseFloat(e.target.value))} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Reason (Optional)</label>
                      <textarea 
                        className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg min-h-[80px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm resize-none"
                        value={overrideReason} 
                        onChange={e => setOverrideReason(e.target.value)} 
                        placeholder="Why are you changing these marks?"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleOverride} className="flex-1 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">
                        Save Marks
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  className="w-full py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    setIsEditing(true); 
                    setOverrideMarks(selectedEval.final_marks);
                    setOverrideReason("");
                  }}
                >
                  <Edit3 className="w-4 h-4" /> Override Marks
                </button>
              )}

              <div className="space-y-6">
                {selectedEval.matched_concepts && selectedEval.matched_concepts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Matched Concepts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEval.matched_concepts.map((c, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEval.missing_concepts && selectedEval.missing_concepts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Missing Concepts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEval.missing_concepts.map((c, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-red-50 text-red-800 border border-red-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AI Feedback</h4>
                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedEval.feedback || "No specific feedback provided."}
                </div>
              </div>
              
              {selectedEval.rubric_breakdown && selectedEval.rubric_breakdown.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rubric Breakdown</h4>
                  <div className="space-y-2">
                    {selectedEval.rubric_breakdown.map((r: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-3 bg-white border border-gray-100 shadow-sm rounded-xl">
                        <span className="text-gray-700 font-medium truncate mr-3" title={r.criterion}>{r.criterion}</span>
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md shrink-0">{r.awarded_marks}/{r.max_marks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-10 flex flex-col items-center text-center text-gray-500 mt-10">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">No Question Selected</h3>
              <p className="text-sm">Select a question from the left panel to view its detailed AI evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
