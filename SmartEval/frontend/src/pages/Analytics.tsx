import { useState, useEffect } from "react"
import { getExams, type Exam, getExamAnalytics } from "../services/api"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)

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
      getExamAnalytics(selectedExamId).then(setAnalytics).catch(console.error)
    }
  }, [selectedExamId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Class Analytics</h1>
          <p className="text-gray-500 mt-1">Insights and performance distribution across your exams.</p>
        </div>
        <select 
          className="border p-2 rounded-md"
          value={selectedExamId || ""}
          onChange={e => setSelectedExamId(parseInt(e.target.value))}
        >
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>{exam.name}</option>
          ))}
        </select>
      </div>

      {analytics ? (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Average Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-700">{analytics.average_marks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Highest Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.highest_marks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Lowest Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{analytics.lowest_marks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pass_rate}%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {analytics.distribution ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.distribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="range" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                        <RechartsTooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded border border-dashed">
                      Need distribution data from backend for this chart.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 text-gray-500">Loading analytics...</div>
      )}
    </div>
  )
}
