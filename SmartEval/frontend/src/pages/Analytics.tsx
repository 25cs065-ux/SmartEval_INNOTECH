import { useState, useEffect } from "react"
import { getExams, type Exam, getExamAnalytics } from "../services/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Target, Award, ChevronDown, BarChart2, CheckCircle2, Sparkles } from "lucide-react"

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

  // Mock distribution data if API doesn't provide it yet
  const displayDistribution = analytics?.distribution || [
    { range: '0-20%', count: 1 },
    { range: '21-40%', count: 2 },
    { range: '41-60%', count: 8 },
    { range: '61-80%', count: 12 },
    { range: '81-100%', count: 5 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Class Analytics</h1>
          <p className="text-[#64748B] mt-2 text-sm">Insights and performance distribution across your exams.</p>
        </div>
        <div className="relative">
          <select 
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
            value={selectedExamId || ""}
            onChange={e => setSelectedExamId(parseInt(e.target.value))}
          >
            {exams.length === 0 ? (
              <option value="">No exams available</option>
            ) : (
              exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))
            )}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {analytics ? (
        <div className="grid gap-6">
          <div className="grid gap-5 md:grid-cols-4">
            {/* KPI Card 1 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +4%
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#64748B] mb-1">Average Marks</div>
                <div className="text-3xl font-bold text-[#0F172A]">{analytics.average_marks}</div>
              </div>
            </div>

            {/* KPI Card 2 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-gray-300">
                  <BarChart2 className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#64748B] mb-1">Highest Marks</div>
                <div className="text-3xl font-bold text-[#0F172A]">{analytics.highest_marks}</div>
              </div>
            </div>

            {/* KPI Card 3 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-gray-300">
                  <BarChart2 className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#64748B] mb-1">Lowest Marks</div>
                <div className="text-3xl font-bold text-[#0F172A]">{analytics.lowest_marks}</div>
              </div>
            </div>

            {/* KPI Card 4 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-indigo-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-gray-300">
                  <BarChart2 className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#64748B] mb-1">Pass Rate</div>
                <div className="text-3xl font-bold text-[#0F172A]">{analytics.pass_rate}%</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
              <div className="mb-6">
                <h3 className="font-bold text-[#0F172A] text-lg">Score Distribution</h3>
                <p className="text-sm text-[#64748B]">Number of students in each percentage range</p>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="range" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      allowDecimals={false} 
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#F1F5F9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {displayDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index === displayDistribution.length - 1 ? '#10B981' : index === 0 ? '#EF4444' : '#2563EB'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights Side Panel */}
            <div className="bg-gradient-to-b from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Key Insights
                </h3>
                <p className="text-sm text-indigo-600/70">AI-generated class performance analysis</p>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                  <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Strengths</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Students generally performed well on theoretical concept questions, with an 85% average score on definitions.</p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Needs Attention</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Questions requiring multi-step calculations saw a 40% drop in accuracy. Consider reviewing Step 3 of the standard algorithm in class.</p>
                </div>
              </div>

              <button 
                onClick={() => window.open(`/exams/${selectedExamId}/report`, '_blank')}
                className="w-full mt-6 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-100/50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Generate Full Report
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 min-h-[400px]">
          <BarChart2 className="w-12 h-12 text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-[#0F172A]">Loading Analytics...</h3>
        </div>
      )}
    </div>
  )
}
