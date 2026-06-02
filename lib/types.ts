export interface FormQuestion {
  id: string
  type: "text" | "textarea" | "radio" | "checkbox" | "rating"
  text: string
  options?: string[]
  required?: boolean
}

export interface SurveyForm {
  id: string
  title: string
  description: string
  questions: FormQuestion[]
  category: string
  responses: number
  createdAt: string
  isTemplate?: boolean
}

export interface FormResponse {
  id: string
  formId: string
  responses: Record<string, string | string[]>
  submittedAt: string
}
