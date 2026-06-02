"use client"

import { useState } from "react"
import { FormQuestion } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface FormPreviewProps {
  title: string
  description: string
  questions: FormQuestion[]
  onSubmit?: (responses: Record<string, string | string[]>) => void
  isPreview?: boolean
}

export function FormPreview({
  title,
  description,
  questions,
  onSubmit,
  isPreview = false,
}: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleTextChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleRadioChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setResponses((prev) => {
      const currentValues = (prev[questionId] as string[]) || []
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, option] }
      } else {
        return { ...prev, [questionId]: currentValues.filter((v) => v !== option) }
      }
    })
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(responses)
    }
    setSubmitted(true)
  }

  if (submitted && !isPreview) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">تم إرسال إجاباتك بنجاح!</h2>
          <p className="text-muted-foreground">شكراً لك على المشاركة في هذا الاستبيان</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription className="text-base mt-2">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <Label className="text-base font-medium flex items-start gap-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">
                {index + 1}
              </span>
              <span>{question.text}</span>
              {question.required && <span className="text-destructive">*</span>}
            </Label>

            {question.type === "text" && (
              <Input
                placeholder="أدخل إجابتك هنا..."
                value={(responses[question.id] as string) || ""}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
                disabled={isPreview}
              />
            )}

            {question.type === "textarea" && (
              <Textarea
                placeholder="أدخل إجابتك هنا..."
                value={(responses[question.id] as string) || ""}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
                disabled={isPreview}
                rows={4}
              />
            )}

            {question.type === "radio" && question.options && (
              <RadioGroup
                value={(responses[question.id] as string) || ""}
                onValueChange={(value) => handleRadioChange(question.id, value)}
                disabled={isPreview}
                className="space-y-2"
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                    <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "checkbox" && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isChecked = ((responses[question.id] as string[]) || []).includes(option)
                  return (
                    <div
                      key={optionIndex}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`${question.id}-${optionIndex}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(question.id, option, checked as boolean)
                        }
                        disabled={isPreview}
                      />
                      <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  )
                })}
              </div>
            )}

            {question.type === "rating" && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => !isPreview && handleRadioChange(question.id, rating.toString())}
                    disabled={isPreview}
                    className={`w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all ${
                      responses[question.id] === rating.toString()
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {!isPreview && (
          <Button onClick={handleSubmit} size="lg" className="w-full">
            إرسال الإجابات
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
