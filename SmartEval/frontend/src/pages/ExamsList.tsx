import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getExams, type Exam } from "../services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Plus } from "lucide-react"

export default function ExamsList() {
  const [exams, setExams] = useState<Exam[]>([])
  
  useEffect(() => {
    getExams().then(setExams).catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">All Exams</h1>
          <p className="text-sm text-gray-500">Manage all your created exams and their marking schemes.</p>
        </div>
        <Link to="/exams/create">
          <Button><Plus className="w-4 h-4 mr-2" /> Create Exam</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.map(exam => (
          <Card key={exam.id}>
            <CardHeader>
              <CardTitle>{exam.name}</CardTitle>
              <CardDescription>{exam.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-4 space-y-1">
                <div><strong>Code:</strong> {exam.exam_code || 'N/A'}</div>
                <div><strong>Date:</strong> {exam.exam_date || 'N/A'}</div>
                <div><strong>Marks:</strong> {exam.total_marks || 0}</div>
              </div>
              <Link to={`/exams/${exam.id}`}>
                <Button variant="outline" className="w-full">Manage Exam</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {exams.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
            No exams created yet. Click the button above to create one.
          </div>
        )}
      </div>
    </div>
  )
}
