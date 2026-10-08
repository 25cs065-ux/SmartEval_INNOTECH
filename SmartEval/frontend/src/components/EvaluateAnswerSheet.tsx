import { useState, useRef } from "react"
import { uploadSubmission, evaluateSubmission, type Exam } from "../services/api"
import { Card, CardContent } from "./ui/Card"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { FileUp, File, Loader2, CheckCircle2 } from "lucide-react"
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
    "Uploading file...",
    "Reading pages and identifying questions...",
    "Understanding handwriting via Gemini...",
    "Matching answers to marking scheme...",
    "Applying teacher rubric...",
    "Calculating marks and generating feedback...",
    "Saving evaluation..."
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

      // Simulate steps for the live demo visual effect
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
        navigate(`/results/${submission.id}`) // We will build this page next
      }, 1000)

    } catch (error) {
      setIsUploading(false)
      setIsEvaluating(false)
      toast.error("Evaluation failed. Please try again.")
      console.error(error)
    }
  }

  if (isEvaluating || isUploading) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6">
          <Loader2 className="h-16 w-16 text-primary-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900">AI EVALUATION IN PROGRESS</h2>
          <div className="w-full max-w-md bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.max(10, (progressStep / (steps.length - 1)) * 100)}%` }}
            ></div>
          </div>
          <div className="space-y-2 text-left w-full max-w-md">
            {steps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm ${i > progressStep ? 'text-gray-300' : i === progressStep ? 'text-primary-600 font-medium' : 'text-green-600'}`}>
                {i < progressStep ? <CheckCircle2 className="w-4 h-4" /> : i === progressStep ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-200" />}
                {step}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="bg-primary-50 rounded-lg p-4 mb-8 border border-primary-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Evaluating For</div>
              <div className="text-lg font-bold text-gray-900">{exam.name}</div>
              <div className="text-sm text-gray-600">{exam.subject} • {exam.total_marks} Marks</div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-primary-400" />
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Name</label>
                <Input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="e.g. Khushi Patel" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll Number</label>
                <Input value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. 25CS065" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Student Answer Sheet</label>
              
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm font-medium text-gray-900">Click to choose a file</div>
                  <div className="text-xs text-gray-500 mt-1">Supports PDF, PNG, JPG</div>
                </div>
              ) : (
                <div className="border rounded-xl p-4 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-primary-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                    Remove
                  </Button>
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

            <div className="pt-4">
              <Button size="lg" className="w-full text-base" onClick={handleStart} disabled={!file || !studentName || !rollNumber}>
                Start AI Evaluation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
