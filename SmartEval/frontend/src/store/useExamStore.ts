import { create } from 'zustand'

interface ExamStore {
  currentExamId: number | null
  setCurrentExamId: (id: number | null) => void
}

export const useExamStore = create<ExamStore>((set) => ({
  currentExamId: null,
  setCurrentExamId: (id) => set({ currentExamId: id }),
}))
