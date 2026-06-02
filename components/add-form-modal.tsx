"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, AlertCircle } from "lucide-react"
import { FORM_CATEGORIES, type MSForm, type FormCategory } from "@/lib/types"

interface AddFormModalProps {
  open: boolean
  onClose: () => void
  onAdd: (form: Omit<MSForm, "id" | "createdAt" | "responsesCount">) => void
}

export function AddFormModal({ open, onClose, onAdd }: AddFormModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [formUrl, setFormUrl] = useState("")
  const [category, setCategory] = useState<FormCategory>("أخرى")
  const [error, setError] = useState("")

  const validateMicrosoftFormsUrl = (url: string): boolean => {
    const patterns = [
      /^https:\/\/forms\.microsoft\.com\//,
      /^https:\/\/forms\.office\.com\//,
    ]
    return patterns.some(pattern => pattern.test(url))
  }

  const handleSubmit = () => {
    setError("")
    
    if (!title.trim()) {
      setError("الرجاء إدخال عنوان النموذج")
      return
    }
    
    if (!formUrl.trim()) {
      setError("الرجاء إدخال رابط Microsoft Forms")
      return
    }
    
    if (!validateMicrosoftFormsUrl(formUrl)) {
      setError("الرجاء إدخال رابط Microsoft Forms صحيح")
      return
    }

    onAdd({
      title: title.trim(),
      description: description.trim(),
      formUrl: formUrl.trim(),
      category,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setFormUrl("")
    setCategory("أخرى")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            إضافة نموذج Microsoft Forms
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان النموذج *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تقييم الدورة التدريبية"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formUrl">رابط Microsoft Forms *</Label>
            <Input
              id="formUrl"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://forms.microsoft.com/..."
              dir="ltr"
              className="h-11 text-left"
            />
            <p className="text-xs text-muted-foreground">
              انسخ الرابط من Microsoft Forms عند مشاركة النموذج
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف النموذج</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر للنموذج..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">التصنيف</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as FormCategory)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit} className="flex-1 h-11">
              <Plus className="w-4 h-4 ml-2" />
              إضافة النموذج
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 h-11">
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
