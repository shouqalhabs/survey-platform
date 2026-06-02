"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { FormPreview } from "@/components/form-preview"
import { formTemplates } from "@/lib/form-data"
import { SurveyForm } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

// In a real app, this would fetch from your database
const sampleForms: SurveyForm[] = [
  {
    id: "form-1",
    title: "تقييم دورة التسويق الرقمي",
    description: "استبيان لتقييم دورة التسويق الرقمي المتقدمة",
    category: "تعليم",
    responses: 45,
    createdAt: "2024-01-15",
    questions: formTemplates[0].questions,
  },
  {
    id: "form-2",
    title: "استبيان رضا المتدربين",
    description: "قياس مستوى رضا المتدربين عن الخدمات",
    category: "خدمات",
    responses: 128,
    createdAt: "2024-01-10",
    questions: formTemplates[1].questions,
  },
]

export default function FormPage() {
  const params = useParams()
  const [form, setForm] = useState<SurveyForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Simulate fetching form data
    const foundForm = sampleForms.find((f) => f.id === params.id)
    if (foundForm) {
      setForm(foundForm)
    } else {
      setNotFound(true)
    }
    setLoading(false)
  }, [params.id])

  const handleSubmit = (responses: Record<string, string | string[]>) => {
    // In a real app, this would save to your database
    console.log("Form submitted:", responses)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (notFound || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">الاستبيان غير موجود</h1>
          <p className="text-muted-foreground">
            عذراً، لم نتمكن من العثور على الاستبيان المطلوب
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <FormPreview
        title={form.title}
        description={form.description}
        questions={form.questions}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
