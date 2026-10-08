import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

// Types
export interface Exam {
  id: number
  name: string
  subject?: string
  exam_code?: string
  exam_date?: string
  academic_year?: string
  total_marks?: number
  created_at: string
}

export interface Question {
  id?: number
  exam_id?: number
  question_number: string
  max_marks: number
  keywords?: string
  expected_answer?: string
  required_concepts?: string
  rubric?: string
  display_order: number
}

export interface Submission {
  id: number
  exam_id: number
  student_name: string
  student_roll_number: string
  original_file_url: string
  submission_status: string
  uploaded_at: string
  evaluated_at?: string
  total_marks?: number
  obtained_marks?: number
  percentage?: number
}

export interface QuestionEvaluation {
  id: number
  submission_id: number
  question_id: number
  ai_marks: number
  teacher_marks: number
  final_marks: number
  max_marks: number
  confidence: number
  matched_concepts: string[]
  missing_concepts: string[]
  feedback: string
  rubric_breakdown: any
}

// API functions
export const getExams = () => api.get<Exam[]>('/exams').then(res => res.data)
export const getExam = (id: number) => api.get<Exam>(`/exams/${id}`).then(res => res.data)
export const createExam = (data: Partial<Exam>) => api.post<Exam>('/exams', data).then(res => res.data)

export const getQuestions = (examId: number) => api.get<Question[]>(`/exams/${examId}/questions`).then(res => res.data)
export const saveMarkingScheme = (examId: number, questions: Question[]) => api.post<Question[]>(`/exams/${examId}/marking-scheme`, questions).then(res => res.data)

export const getSubmissions = (examId: number) => api.get<Submission[]>(`/submissions/exam/${examId}`).then(res => res.data)
export const uploadSubmission = (examId: number, formData: FormData) => api.post<Submission>(`/submissions/exam/${examId}`, formData).then(res => res.data)
export const evaluateSubmission = (submissionId: number) => api.post(`/submissions/${submissionId}/evaluate`).then(res => res.data)
export const getEvaluations = (submissionId: number) => api.get<QuestionEvaluation[]>(`/submissions/${submissionId}/evaluations`).then(res => res.data)
export const overrideEvaluation = (evalId: number, data: { new_marks: number, reason?: string }) => api.put<QuestionEvaluation>(`/submissions/evaluations/${evalId}/override`, data).then(res => res.data)
export const getExamAnalytics = (examId: number) => api.get(`/exams/${examId}/analytics`).then(res => res.data)
