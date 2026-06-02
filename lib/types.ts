export interface MSForm {
  id: string
  title: string
  description: string
  formUrl: string
  createdAt: string
  category: string
  responsesCount: number
}

export type FormCategory = "تقييم دورات" | "رضا العملاء" | "استطلاع موظفين" | "ورش عمل" | "فعاليات" | "أخرى"

export const FORM_CATEGORIES: FormCategory[] = [
  "تقييم دورات",
  "رضا العملاء", 
  "استطلاع موظفين",
  "ورش عمل",
  "فعاليات",
  "أخرى"
]
