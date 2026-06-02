"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  QrCode,
  ExternalLink,
  MoreVertical,
  Trash2,
  FileText,
  ClipboardList,
  Calendar,
  FolderOpen,
  Users,
  Sparkles,
} from "lucide-react"
import { QRCodeModal } from "./qr-code-modal"
import { AddFormModal } from "./add-form-modal"
import type { MSForm } from "@/lib/types"

const initialForms: MSForm[] = [
  {
    id: "1",
    title: "تقييم الدورة التدريبية",
    description: "نموذج لتقييم مستوى الرضا عن الدورات التدريبية",
    formUrl: "https://forms.microsoft.com/r/example1",
    createdAt: new Date().toISOString(),
    category: "تقييم دورات",
    responsesCount: 45,
  },
  {
    id: "2", 
    title: "استطلاع رضا العملاء",
    description: "قياس مستوى رضا العملاء عن خدماتنا",
    formUrl: "https://forms.microsoft.com/r/example2",
    createdAt: new Date().toISOString(),
    category: "رضا العملاء",
    responsesCount: 128,
  },
  {
    id: "3",
    title: "تقييم ورشة العمل",
    description: "نموذج تقييم ورش العمل التفاعلية",
    formUrl: "https://forms.microsoft.com/r/example3",
    createdAt: new Date().toISOString(),
    category: "ورش عمل",
    responsesCount: 32,
  },
]

const categoryColors: Record<string, string> = {
  "تقييم دورات": "bg-blue-500",
  "رضا العملاء": "bg-emerald-500",
  "استطلاع موظفين": "bg-violet-500",
  "ورش عمل": "bg-amber-500",
  "فعاليات": "bg-rose-500",
  "أخرى": "bg-slate-500",
}

const categoryBadgeColors: Record<string, string> = {
  "تقييم دورات": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  "رضا العملاء": "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  "استطلاع موظفين": "bg-violet-100 text-violet-700 hover:bg-violet-100",
  "ورش عمل": "bg-amber-100 text-amber-700 hover:bg-amber-100",
  "فعاليات": "bg-rose-100 text-rose-700 hover:bg-rose-100",
  "أخرى": "bg-slate-100 text-slate-700 hover:bg-slate-100",
}

const categoryIcons: Record<string, React.ReactNode> = {
  "تقييم دورات": <ClipboardList className="w-5 h-5 text-white" />,
  "رضا العملاء": <Users className="w-5 h-5 text-white" />,
  "استطلاع موظفين": <Users className="w-5 h-5 text-white" />,
  "ورش عمل": <Calendar className="w-5 h-5 text-white" />,
  "فعاليات": <Sparkles className="w-5 h-5 text-white" />,
  "أخرى": <FolderOpen className="w-5 h-5 text-white" />,
}

export function SurveyPlatform() {
  const [forms, setForms] = useState<MSForm[]>(initialForms)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedForm, setSelectedForm] = useState<MSForm | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.includes(searchQuery) || 
                         form.description.includes(searchQuery)
    const matchesCategory = !activeCategory || form.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(forms.map(f => f.category))]

  const handleAddForm = (formData: Omit<MSForm, "id" | "createdAt" | "responsesCount">) => {
    const newForm: MSForm = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      responsesCount: 0,
    }
    setForms([newForm, ...forms])
  }

  const handleDeleteForm = (id: string) => {
    setForms(forms.filter(f => f.id !== id))
  }

  const openQRModal = (form: MSForm) => {
    setSelectedForm(form)
    setShowQRModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">منصة الاستبيانات</h1>
                <p className="text-xs text-muted-foreground">إدارة نماذج Microsoft Forms</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-l from-primary to-info hover:opacity-90 gap-2 shadow-lg shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              إضافة نموذج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="bg-white border-0 shadow-lg shadow-primary/5 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-stretch">
                <div className="w-2 bg-gradient-to-b from-primary to-primary/50" />
                <div className="flex items-center justify-between flex-1 p-5">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">إجمالي النماذج</p>
                    <p className="text-4xl font-bold text-foreground">{forms.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg shadow-accent/5 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-stretch">
                <div className="w-2 bg-gradient-to-b from-accent to-accent/50" />
                <div className="flex items-center justify-between flex-1 p-5">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">إجمالي الردود</p>
                    <p className="text-4xl font-bold text-foreground">
                      {forms.reduce((sum, f) => sum + f.responsesCount, 0)}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-accent-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg shadow-info/5 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-stretch">
                <div className="w-2 bg-gradient-to-b from-info to-info/50" />
                <div className="flex items-center justify-between flex-1 p-5">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">التصنيفات</p>
                    <p className="text-4xl font-bold text-foreground">{categories.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-info/10 rounded-2xl flex items-center justify-center">
                    <FolderOpen className="w-7 h-7 text-info" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="البحث في النماذج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-11 h-12 bg-white shadow-sm border-0 text-base"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              onClick={() => setActiveCategory(null)}
              className={`h-12 px-5 ${activeCategory === null ? "shadow-lg shadow-primary/25" : "bg-white"}`}
            >
              الكل
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`h-12 px-5 ${activeCategory === cat ? "shadow-lg shadow-primary/25" : "bg-white"}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <Card className="p-16 text-center bg-white border-0 shadow-lg">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">لا توجد نماذج</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery ? "لم يتم العثور على نتائج للبحث" : "ابدأ بإضافة رابط Microsoft Forms لتوليد QR Code له"}
            </p>
            <Button onClick={() => setShowAddModal(true)} size="lg" className="gap-2 shadow-lg shadow-primary/25">
              <Plus className="w-5 h-5" />
              إضافة نموذج
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredForms.map((form) => (
              <Card 
                key={form.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Colored top bar */}
                  <div className={`h-2 ${categoryColors[form.category] || "bg-slate-500"}`} />
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[form.category] || "bg-slate-500"} shadow-lg`}>
                        {categoryIcons[form.category] || <FileText className="w-5 h-5 text-white" />}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -ml-1">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(form.formUrl, "_blank")}>
                            <ExternalLink className="w-4 h-4 ml-2" />
                            فتح النموذج
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openQRModal(form)}>
                            <QrCode className="w-4 h-4 ml-2" />
                            عرض QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteForm(form.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{form.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                      {form.description || "لا يوجد وصف"}
                    </p>

                    <div className="flex items-center justify-between mb-5">
                      <Badge className={categoryBadgeColors[form.category] || "bg-slate-100 text-slate-700"}>
                        {form.category}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground">
                        {form.responsesCount} رد
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => openQRModal(form)} 
                        className="flex-1 gap-2 shadow-md shadow-primary/20"
                      >
                        <QrCode className="w-4 h-4" />
                        QR Code
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(form.formUrl, "_blank")}
                        className="flex-1 gap-2 bg-secondary/50"
                      >
                        <ExternalLink className="w-4 h-4" />
                        فتح
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <Card className="mt-8 bg-gradient-to-l from-info/10 via-primary/5 to-accent/10 border-0">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">كيفية الاستخدام</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  1. أنشئ نموذج في Microsoft Forms
                  <span className="mx-2">←</span>
                  2. انسخ رابط المشاركة
                  <span className="mx-2">←</span>
                  3. أضفه هنا
                  <span className="mx-2">←</span>
                  4. احصل على QR Code جاهز للمشاركة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <QRCodeModal
        open={showQRModal}
        onClose={() => setShowQRModal(false)}
        form={selectedForm}
      />
      
      <AddFormModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddForm}
      />
    </div>
  )
}
