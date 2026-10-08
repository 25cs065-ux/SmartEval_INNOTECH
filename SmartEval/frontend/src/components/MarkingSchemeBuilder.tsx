import { useState, useEffect } from "react"
import { saveMarkingScheme, type Question } from "../services/api"
import { Plus, Trash2, Save, FileText, CheckCircle2, GraduationCap, GripVertical } from "lucide-react"
import { toast } from "sonner"

export default function MarkingSchemeBuilder({ examId, initialQuestions, onSave }: { examId: number, initialQuestions: Question[], onSave: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions)
    } else {
      const defaults = Array.from({ length: 24 }).map((_, i) => ({
        question_number: `Q${i + 1}`,
        max_marks: 5,
        keywords: "",
        expected_answer: "",
        required_concepts: "",
        rubric: "",
        display_order: i
      }))
      setQuestions(defaults)
    }
  }, [initialQuestions])

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQ = [...questions]
    newQ[index] = { ...newQ[index], [field]: value }
    setQuestions(newQ)
  }

  const addQuestion = () => {
    setQuestions([...questions, {
      question_number: `Q${questions.length + 1}`,
      max_marks: 5,
      keywords: "",
      expected_answer: "",
      required_concepts: "",
      rubric: "",
      display_order: questions.length
    }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      const ordered = questions.map((q, i) => ({ ...q, display_order: i }))
      await saveMarkingScheme(examId, ordered)
      toast.success("Marking scheme saved successfully")
      onSave()
    } catch (error) {
      toast.error("Failed to save marking scheme")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Sticky Header Actions */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-4 z-20">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Marking Scheme</h2>
          <p className="text-sm font-medium text-gray-500 mt-0.5">{questions.length} questions defined</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={addQuestion}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm shadow-primary-200"
          >
            <Save className="w-4 h-4" /> Save Scheme
          </button>
        </div>
      </div>

      {/* Question Cards */}
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-primary-100 transition-colors">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab opacity-30 hover:opacity-100 transition-opacity">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Question</label>
                    <input 
                      className="w-20 font-bold text-lg text-gray-900 bg-transparent border-none p-0 focus:ring-0" 
                      value={q.question_number} 
                      onChange={e => updateQuestion(i, 'question_number', e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-200"></div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Marks</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number" 
                      className="w-16 font-bold text-lg text-primary-600 bg-transparent border-none p-0 focus:ring-0" 
                      value={q.max_marks} 
                      onChange={e => updateQuestion(i, 'max_marks', parseFloat(e.target.value) || 0)} 
                    />
                    <span className="text-sm font-medium text-gray-400">marks</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => removeQuestion(i)} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-6 grid gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Keywords / Expected Answer
                </div>
                <textarea 
                  placeholder="List key phrases or the exact expected answer..." 
                  value={q.expected_answer || q.keywords}
                  onChange={e => {
                    updateQuestion(i, 'expected_answer', e.target.value)
                    updateQuestion(i, 'keywords', e.target.value)
                  }}
                  className="w-full min-h-[80px] p-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-gray-700 bg-white placeholder:text-gray-400 resize-y"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Required Concepts
                </div>
                <textarea 
                  placeholder="Explain the concepts the student must demonstrate..." 
                  value={q.required_concepts || ''}
                  onChange={e => updateQuestion(i, 'required_concepts', e.target.value)}
                  className="w-full min-h-[80px] p-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm text-gray-700 bg-white placeholder:text-gray-400 resize-y"
                />
              </div>

              <div className="space-y-3 bg-indigo-50/50 -mx-6 -mb-6 p-6 border-t border-indigo-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  Teacher Rubric (Evaluation Rules)
                  <span className="ml-2 text-xs font-medium text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">AI Instructions</span>
                </div>
                <textarea 
                  placeholder="Example: 1 mark for correct definition, 2 marks for explanation..." 
                  value={q.rubric || ''}
                  onChange={e => updateQuestion(i, 'rubric', e.target.value)}
                  className="w-full min-h-[100px] p-3.5 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-indigo-900 bg-white placeholder:text-indigo-300 resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center pt-8">
        <button 
          onClick={addQuestion} 
          className="px-6 py-3 w-full max-w-sm text-sm font-semibold text-gray-500 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Another Question
        </button>
      </div>
    </div>
  )
}
