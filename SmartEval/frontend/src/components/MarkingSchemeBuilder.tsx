import { useState, useEffect } from "react"
import { saveMarkingScheme, type Question } from "../services/api"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/Textarea"
import { Plus, Trash2, Save, Copy } from "lucide-react"
import { toast } from "sonner"

export default function MarkingSchemeBuilder({ examId, initialQuestions, onSave }: { examId: number, initialQuestions: Question[], onSave: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions)
    } else {
      // Default to 24 questions as requested
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
      // Ensure orders are correct
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
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border sticky top-0 z-10 shadow-sm">
        <div>
          <h2 className="text-xl font-bold">Marking Scheme</h2>
          <p className="text-sm text-gray-500">{questions.length} questions defined</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save Marking Scheme
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <Card key={i} className="border-l-4 border-l-primary-600">
            <CardHeader className="flex flex-row items-center justify-between py-4 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 font-medium">Question</label>
                  <Input 
                    className="w-24 font-bold" 
                    value={q.question_number} 
                    onChange={e => updateQuestion(i, 'question_number', e.target.value)} 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 font-medium">Max Marks</label>
                  <Input 
                    type="number" 
                    className="w-24" 
                    value={q.max_marks} 
                    onChange={e => updateQuestion(i, 'max_marks', parseFloat(e.target.value) || 0)} 
                  />
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeQuestion(i)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Keywords / Expected Answer</label>
                <Textarea 
                  placeholder="List key phrases or the exact expected answer..." 
                  value={q.expected_answer || q.keywords}
                  onChange={e => {
                    updateQuestion(i, 'expected_answer', e.target.value)
                    updateQuestion(i, 'keywords', e.target.value) // Sync for now or split in UI
                  }}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Required Concepts</label>
                <Textarea 
                  placeholder="Explain the concepts the student must demonstrate..." 
                  value={q.required_concepts || ''}
                  onChange={e => updateQuestion(i, 'required_concepts', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Teacher Rubric (Evaluation Rules)</label>
                <Textarea 
                  placeholder="Example: 1 mark for correct definition, 2 marks for explanation..." 
                  value={q.rubric || ''}
                  onChange={e => updateQuestion(i, 'rubric', e.target.value)}
                  className="min-h-[100px] bg-amber-50/30 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={addQuestion} className="w-full max-w-sm border-dashed">
          <Plus className="w-4 h-4 mr-2" /> Add Another Question
        </Button>
      </div>
    </div>
  )
}
