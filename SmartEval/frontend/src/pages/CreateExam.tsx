import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createExam } from "../services/api"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import { toast } from "sonner"

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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Exam</h1>
        <p className="text-gray-500 mt-1">Fill in the details to create a new examination.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam Name</label>
              <Input 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Mid-Semester Examination" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input 
                  required 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g. Computer Networks" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Exam Code</label>
                <Input 
                  value={formData.exam_code}
                  onChange={e => setFormData({...formData, exam_code: e.target.value})}
                  placeholder="e.g. CS101" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Exam Date</label>
                <Input 
                  type="date"
                  value={formData.exam_date}
                  onChange={e => setFormData({...formData, exam_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input 
                  type="number"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Optional description" 
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Save Exam</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
