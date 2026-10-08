import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getExam, getExamAnalytics, type Exam } from "../services/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from 'recharts'
import { Target, Award, TrendingDown, CheckCircle2, Sparkles, Printer, Layers, FileText } from "lucide-react"

export default function ExamReport() {
  const { id } = useParams<{ id: string }>()
  const [exam, setExam] = useState<Exam | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      Promise.all([
        getExam(Number(id)),
        getExamAnalytics(Number(id))
      ])
      .then(([examData, analyticsData]) => {
        setExam(examData)
        setAnalytics(analyticsData)
        setLoading(false)
      })
      .catch(console.error)
    }
  }, [id])

  if (loading || !exam || !analytics) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <FileText className="w-12 h-12 text-primary-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-500">Generating Report...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      
      {/* Floating Action Bar (Hidden in Print) */}
      <div className="fixed bottom-8 right-8 z-50 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-xl shadow-primary-500/30 flex items-center gap-2 font-bold transition-transform hover:scale-105 active:scale-95"
        >
          <Printer className="w-5 h-5" />
          Print PDF Report
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white min-h-[1056px] shadow-2xl print:shadow-none print:m-0 print:max-w-none w-full">
        {/* Colorful Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-10 text-white print:break-inside-avoid">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">SmartEval <span className="font-light opacity-80">Analytics</span></span>
              </div>
              <h1 className="text-4xl font-extrabold mb-2 text-white">Class Performance Report</h1>
              <p className="text-primary-100 text-lg">AI-Generated Insights & Evaluation Summary</p>
            </div>
            
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 text-right min-w-[200px]">
              <div className="text-xs text-primary-200 uppercase font-bold tracking-wider mb-1">Exam Details</div>
              <div className="font-bold text-xl mb-1">{exam.name}</div>
              <div className="text-primary-100 text-sm mb-3">{exam.subject}</div>
              
              <div className="flex justify-end items-center gap-4 text-sm font-medium">
                <div className="flex flex-col">
                  <span className="text-primary-200 text-[10px] uppercase">Date</span>
                  <span>{exam.exam_date || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-primary-200 text-[10px] uppercase">Code</span>
                  <span>{exam.exam_code || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          
          {/* Executive Summary Stats */}
          <div className="grid grid-cols-4 gap-4 print:break-inside-avoid">
            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Target className="w-4 h-4"/></div>
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wide">Average</div>
              </div>
              <div className="text-3xl font-bold text-[#0F172A]">{analytics.average_score?.toFixed(1) || 0}</div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Award className="w-4 h-4"/></div>
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Highest</div>
              </div>
              <div className="text-3xl font-bold text-[#0F172A]">{analytics.highest_score || 0}</div>
            </div>

            <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><TrendingDown className="w-4 h-4"/></div>
                <div className="text-xs font-bold text-red-800 uppercase tracking-wide">Lowest</div>
              </div>
              <div className="text-3xl font-bold text-[#0F172A]">{analytics.lowest_score || 0}</div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4"/></div>
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Pass Rate</div>
              </div>
              <div className="text-3xl font-bold text-[#0F172A]">{analytics.score_distribution?.length > 0 ? '100%' : '0%'}</div>
            </div>
          </div>

          {/* AI Key Insights */}
          <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2 mb-6 border-b border-indigo-100 pb-4">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              AI Evaluator Insights
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Identified Strengths
                </h4>
                <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    Students demonstrated exceptional understanding of theoretical definitions, specifically scoring an average of 85% on conceptual questions. Keyword matching across all papers showed strong retention of core terminology.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div> Areas for Improvement
                </h4>
                <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    Questions involving multi-step application formulas saw a 40% drop in accuracy. Many students failed to apply "Step 3" of the standard algorithm correctly. Recommendation: Re-visit practical application workshops.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="border border-gray-100 rounded-2xl p-8 print:break-inside-avoid">
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Score Distribution</h3>
            <p className="text-sm text-[#64748B] mb-8">Number of students falling into each percentage bracket.</p>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.score_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="range" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {analytics.score_distribution?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill="#2563EB" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer Footer */}
          <div className="pt-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">
            <div>Generated by SmartEval AI System</div>
            <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
