import { useState, useRef } from "react"
import { uploadSubmission, evaluateSubmission, type Exam } from "../services/api"
import { FileUp, File, Loader2, CheckCircle2, AlertCircle, FileText, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function EvaluateAnswerSheet({ exam, onEvaluationComplete }: { exam: Exam, onEvaluationComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [studentName, setStudentName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [progressStep, setProgressStep] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const steps = [
    "Uploading secure file...",
    "Extracting pages & mapping questions...",
    "AI handwriting recognition & understanding...",
    "Matching concepts against marking scheme...",
    "Applying strict teacher rubric...",
    "Calculating final marks & generating feedback...",
    "Saving evaluation report..."
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleStart = async () => {
    if (!file || !studentName || !rollNumber) {
      toast.error("Please fill all details and select a file.")
      return
    }

    try {
      setIsUploading(true)
      setProgressStep(0)
      
      const formData = new FormData()
      formData.append("file", file)
      formData.append("student_name", studentName)
      formData.append("student_roll_number", rollNumber)

      const submission = await uploadSubmission(exam.id, formData)
      
      setIsUploading(false)
      setIsEvaluating(true)

      const interval = setInterval(() => {
        setProgressStep(prev => {
          if (prev >= steps.length - 2) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 2000)

      await evaluateSubmission(submission.id)
      
      clearInterval(interval)
      setProgressStep(steps.length - 1)
      
      setTimeout(() => {
        toast.success("Evaluation complete!")
        setIsEvaluating(false)
        onEvaluationComplete()
        navigate(`/results/${submission.id}`)
      }, 1000)

    } catch (error) {
      setIsUploading(false)
      setIsEvaluating(false)
      toast.error("Evaluation failed. Please try again.")
      console.error(error)
    }
  }

  if (isEvaluating || isUploading) {
    const progressPercent = Math.max(5, (progressStep / (steps.length - 1)) * 100)
    
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Background subtle effect */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Sparkles className="h-10 w-10 text-indigo-600 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Evaluation in Progress</h2>
          <p className="text-gray-500 text-sm mb-8">Please don't close this window. We're processing the answer sheet.</p>
          
          <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 mb-8 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out relative" 
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
          
          <div className="space-y-3 text-left w-full max-w-md bg-gray-50 p-6 rounded-xl border border-gray-100">
            {steps.map((step, i) => {
              const isPast = i < progressStep;
              const isCurrent = i === progressStep;
              const isFuture = i > progressStep;
              
              return (
                <div key={i} className={`flex items-start gap-3 text-sm transition-all duration-300 ${
                  isPast ? 'text-emerald-700 opacity-70' : 
                  isCurrent ? 'text-indigo-700 font-semibold transform scale-105 origin-left' : 
                  'text-gray-400'
                }`}>
                  <div className="mt-0.5 shrink-0">
                    {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                     isCurrent ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" /> : 
                     <div className="w-4 h-4 rounded-full border-2 border-gray-200" />}
                  </div>
                  {step}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8">
          {/* Summary Box */}
          <div className="bg-indigo-50 rounded-xl p-5 mb-8 border border-indigo-100 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-indigo-50 text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Evaluating For</div>
                <div className="text-lg font-bold text-gray-900">{exam.name}</div>
                <div className="text-sm font-medium text-gray-600">{exam.subject} • {exam.total_marks} Marks</div>
              </div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-indigo-400 hidden sm:block" />
          </div>

          <div className="grid gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Student Name <span className="text-red-500">*</span></label>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                  value={studentName} 
                  onChange={e => setStudentName(e.target.value)} 
                  placeholder="e.g. Khushi Patel" 
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Roll Number <span className="text-red-500">*</span></label>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                  value={rollNumber} 
                  onChange={e => setRollNumber(e.target.value)} 
                  placeholder="e.g. 25CS065" 
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Upload Answer Sheet <span className="text-red-500">*</span></label>
              
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-all group"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                    <FileUp className="h-8 w-8 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-1">Click to upload or drag and drop</div>
                  <div className="text-sm font-medium text-gray-500">PDF, PNG, or JPG (Max 50MB)</div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                      <File className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 line-clamp-1">{file.name}</div>
                      <div className="text-xs font-medium text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to evaluate</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)} 
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button 
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  (!file || !studentName || !rollNumber) 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-200 hover:shadow-lg hover:-translate-y-0.5'
                }`}
                onClick={handleStart} 
                disabled={!file || !studentName || !rollNumber}
              >
                <Sparkles className="w-4 h-4" /> Start AI Evaluation
              </button>
              {(!file || !studentName || !rollNumber) && (
                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Complete all fields to start evaluation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
