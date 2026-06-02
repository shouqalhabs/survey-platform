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
  const [category, setCategory] = useState<FormCategory>("Other")
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
      setError("Please enter a form title")
      return
    }
    
    if (!formUrl.trim()) {
      setError("Please enter a Microsoft Forms link")
      return
    }
    
    if (!validateMicrosoftFormsUrl(formUrl)) {
      setError("Please enter a valid Microsoft Forms link")
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
    setCategory("Other")
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
            Add Microsoft Form
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Training Course Evaluation"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formUrl">Microsoft Forms Link *</Label>
            <Input
              id="formUrl"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://forms.microsoft.com/..."
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Copy the link from Microsoft Forms when sharing the form
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Form Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the form..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
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
              <Plus className="w-4 h-4 mr-2" />
              Add Form
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 h-11">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
