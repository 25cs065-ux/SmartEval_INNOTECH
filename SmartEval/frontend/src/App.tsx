import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import CreateExam from "./pages/CreateExam"
import ExamDetails from "./pages/ExamDetails"
import ResultDetails from "./pages/ResultDetails"
import ExamsList from "./pages/ExamsList"
import Analytics from "./pages/Analytics"
import Results from "./pages/Results"
import Settings from "./pages/Settings"
import { Toaster } from "sonner"

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="exams" element={<ExamsList />} />
            <Route path="exams/create" element={<CreateExam />} />
            <Route path="exams/:id" element={<ExamDetails />} />
            <Route path="results" element={<Results />} />
            <Route path="results/:id" element={<ResultDetails />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </>
  )
}
