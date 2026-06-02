"use client"

import { useState } from "react"
import { FormQuestion, SurveyForm } from "@/lib/types"
import { generateId } from "@/lib/form-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  Star,
} from "lucide-react"

interface FormBuilderProps {
  initialForm?: SurveyForm
  onSave: (form: Omit<SurveyForm, "id" | "responses" | "createdAt">) => void
  onCancel: () => void
}

const questionTypes = [
  { value: "text", label: "نص قصير", icon: Type },
  { value: "textarea", label: "نص طويل", icon: AlignLeft },
  { value: "radio", label: "اختيار واحد", icon: CircleDot },
  { value: "checkbox", label: "اختيارات متعددة", icon: CheckSquare },
  { value: "rating", label: "تقييم", icon: Star },
]

export function FormBuilder({ initialForm, onSave, onCancel }: FormBuilderProps) {
  const [title, setTitle] = useState(initialForm?.title || "")
  const [description, setDescription] = useState(initialForm?.description || "")
  const [category, setCategory] = useState(initialForm?.category || "عام")
  const [questions, setQuestions] = useState<FormQuestion[]>(
    initialForm?.questions || []
  )

  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      id: generateId(),
      type: "text",
      text: "",
      required: false,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    )
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...(q.options || []), ""] }
          : q
      )
    )
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    )
  }

  const deleteOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, idx) => idx !== optionIndex),
            }
          : q
      )
    )
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert("يرجى إدخال عنوان الاستبيان")
      return
    }
    if (questions.length === 0) {
      alert("يرجى إضافة سؤال واحد على الأقل")
      return
    }
    onSave({ title, description, category, questions })
  }

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>إعدادات الاستبيان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الاستبيان *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الاستبيان"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">وصف الاستبيان</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف الاستبيان"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">التصنيف</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="تعليم">تعليم</SelectItem>
                <SelectItem value="خدمات">خدمات</SelectItem>
                <SelectItem value="موارد بشرية">موارد بشرية</SelectItem>
                <SelectItem value="فعاليات">فعاليات</SelectItem>
                <SelectItem value="تسويق">تسويق</SelectItem>
                <SelectItem value="عام">عام</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">الأسئلة ({questions.length})</h2>
          <Button onClick={addQuestion} variant="outline" size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة سؤال
          </Button>
        </div>

        {questions.map((question, index) => (
          <Card key={question.id} className="relative">
            <CardContent className="pt-6">
              <div className="absolute right-4 top-4 cursor-grab text-muted-foreground">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="space-y-4 pr-8">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                    س{index + 1}
                  </span>
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      updateQuestion(question.id, {
                        type: value as FormQuestion["type"],
                        options: ["radio", "checkbox"].includes(value)
                          ? question.options || [""]
                          : undefined,
                      })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 mr-auto">
                    <Label htmlFor={`required-${question.id}`} className="text-sm">
                      إلزامي
                    </Label>
                    <Switch
                      id={`required-${question.id}`}
                      checked={question.required}
                      onCheckedChange={(checked) =>
                        updateQuestion(question.id, { required: checked })
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Input
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(question.id, { text: e.target.value })
                  }
                  placeholder="أدخل نص السؤال..."
                  className="text-base"
                />

                {["radio", "checkbox"].includes(question.type) && (
                  <div className="space-y-2 pr-4">
                    <Label className="text-sm text-muted-foreground">
                      الخيارات:
                    </Label>
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {optionIndex + 1}.
                        </span>
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateOption(question.id, optionIndex, e.target.value)
                          }
                          placeholder={`الخيار ${optionIndex + 1}`}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteOption(question.id, optionIndex)}
                          disabled={(question.options?.length || 0) <= 1}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addOption(question.id)}
                      className="text-primary"
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة خيار
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                لم تقم بإضافة أي أسئلة بعد
              </p>
              <Button onClick={addQuestion}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة سؤال
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 sticky bottom-0 bg-background py-4 border-t border-border">
        <Button onClick={handleSave} size="lg" className="flex-1">
          حفظ الاستبيان
        </Button>
        <Button onClick={onCancel} variant="outline" size="lg">
          إلغاء
        </Button>
      </div>
    </div>
  )
}
