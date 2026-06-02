"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  LayoutDashboard,
  FileStack,
  BarChart3,
  GraduationCap,
  Smile,
  Wrench,
  Package,
  Copy,
  Check,
  Wand2,
} from "lucide-react"
import { QRCodeModal } from "./qr-code-modal"
import { AddFormModal } from "./add-form-modal"
import type { MSForm, FormTemplate } from "@/lib/types"
import { FORM_TEMPLATES } from "@/lib/types"

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
]

const categoryColors: Record<string, string> = {
  "تقييم دورات": "bg-blue-500",
  "رضا العملاء": "bg-emerald-500",
  "استطلاع موظفين": "bg-violet-500",
  "ورش عمل": "bg-amber-500",
  "فعاليات": "bg-rose-500",
  "أخرى": "bg-cyan-500",
}

const categoryBadgeColors: Record<string, string> = {
  "تقييم دورات": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  "رضا العملاء": "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  "استطلاع موظفين": "bg-violet-100 text-violet-700 hover:bg-violet-100",
  "ورش عمل": "bg-amber-100 text-amber-700 hover:bg-amber-100",
  "فعاليات": "bg-rose-100 text-rose-700 hover:bg-rose-100",
  "أخرى": "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
}

const templateIcons: Record<string, React.ReactNode> = {
  graduation: <GraduationCap className="w-6 h-6" />,
  smile: <Smile className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  wrench: <Wrench className="w-6 h-6" />,
  calendar: <Calendar className="w-6 h-6" />,
  package: <Package className="w-6 h-6" />,
}

type ActiveView = "dashboard" | "templates" | "forms" | "analytics"

export function SurveyPlatform() {
  const [forms, setForms] = useState<MSForm[]>(initialForms)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedForm, setSelectedForm] = useState<MSForm | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [newFormName, setNewFormName] = useState("")
  const [copiedQuestions, setCopiedQuestions] = useState(false)

  const filteredForms = forms.filter((form) => {
    return form.title.includes(searchQuery) || form.description.includes(searchQuery)
  })

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

  const handleSelectTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setNewFormName(template.title)
    setShowTemplateModal(true)
    setCopiedQuestions(false)
  }

  const handleCopyQuestions = () => {
    if (selectedTemplate) {
      const questionsText = selectedTemplate.questions.join("\n")
      navigator.clipboard.writeText(questionsText)
      setCopiedQuestions(true)
      setTimeout(() => setCopiedQuestions(false), 2000)
    }
  }

  const handleGenerateForm = () => {
    window.open("https://forms.microsoft.com/", "_blank")
  }

  const sidebarItems = [
    { id: "dashboard" as const, label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "templates" as const, label: "القوالب الجاهزة", icon: FileStack },
    { id: "forms" as const, label: "نماذجي", icon: ClipboardList },
    { id: "analytics" as const, label: "التحليلات", icon: BarChart3, disabled: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-50 via-white to-blue-50/30 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 min-h-screen sticky top-0 flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">منصة الاستبيانات</h1>
              <p className="text-xs text-slate-500">Microsoft Forms</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveView(item.id)}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-right transition-all ${
                activeView === item.id
                  ? "bg-gradient-to-l from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30"
                  : item.disabled
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.disabled && (
                <Badge variant="secondary" className="mr-auto text-[10px] bg-amber-100 text-amber-700">قريباً</Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Info Card */}
        <div className="p-4">
          <Card className="bg-gradient-to-br from-blue-50 to-violet-50 border-0">
            <CardContent className="p-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Power BI</h4>
              <p className="text-xs text-slate-600 mb-3">ربط التحليلات قريباً</p>
              <Button variant="secondary" size="sm" className="w-full" disabled>
                قريباً
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">مرحباً بك</h2>
                <p className="text-slate-500 mt-1">إدارة استبياناتك ونماذج Microsoft Forms</p>
              </div>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-l from-blue-600 to-violet-600 hover:opacity-90 gap-2 shadow-lg shadow-blue-500/30 h-12 px-6"
              >
                <Plus className="w-5 h-5" />
                إضافة نموذج
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="w-2 bg-gradient-to-b from-blue-500 to-blue-600" />
                    <div className="flex items-center justify-between flex-1 p-6">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">إجمالي النماذج</p>
                        <p className="text-4xl font-bold text-slate-900 mt-1">{forms.length}</p>
                      </div>
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="w-2 bg-gradient-to-b from-emerald-500 to-emerald-600" />
                    <div className="flex items-center justify-between flex-1 p-6">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">إجمالي الردود</p>
                        <p className="text-4xl font-bold text-slate-900 mt-1">
                          {forms.reduce((sum, f) => sum + f.responsesCount, 0)}
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <Users className="w-8 h-8 text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="w-2 bg-gradient-to-b from-violet-500 to-violet-600" />
                    <div className="flex items-center justify-between flex-1 p-6">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">القوالب المتاحة</p>
                        <p className="text-4xl font-bold text-slate-900 mt-1">{FORM_TEMPLATES.length}</p>
                      </div>
                      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                        <FileStack className="w-8 h-8 text-violet-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="bg-gradient-to-br from-blue-500 to-violet-600 border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1"
                onClick={() => setActiveView("templates")}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <FileStack className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">إنشاء من قالب</h3>
                  <p className="text-blue-100">اختر من القوالب الجاهزة وأنشئ نموذجك بسرعة</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-gradient-to-br from-emerald-500 to-cyan-600 border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1"
                onClick={() => setShowAddModal(true)}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">إضافة رابط موجود</h3>
                  <p className="text-emerald-100">أضف رابط Microsoft Forms موجود لتوليد QR Code</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Forms */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">آخر النماذج</h3>
                <Button variant="ghost" onClick={() => setActiveView("forms")} className="text-blue-600 hover:text-blue-700">
                  عرض الكل
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {forms.slice(0, 3).map((form) => (
                  <FormCard
                    key={form.id}
                    form={form}
                    onQRClick={() => openQRModal(form)}
                    onDelete={() => handleDeleteForm(form.id)}
                    categoryColors={categoryColors}
                    categoryBadgeColors={categoryBadgeColors}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates View */}
        {activeView === "templates" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">القوالب الجاهزة</h2>
              <p className="text-slate-500 mt-1">اختر قالباً وأدخل اسم النموذج لتوليده في Microsoft Forms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FORM_TEMPLATES.map((template) => (
                <Card 
                  key={template.id}
                  className="bg-white border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group overflow-hidden"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardContent className="p-0">
                    <div className={`h-2 ${categoryColors[template.category]}`} />
                    <div className="p-6">
                      <div className={`w-14 h-14 ${categoryColors[template.category]} rounded-2xl flex items-center justify-center text-white shadow-lg mb-4`}>
                        {templateIcons[template.icon]}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{template.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={categoryBadgeColors[template.category]}>
                          {template.category}
                        </Badge>
                        <span className="text-xs text-slate-400">{template.questions.length} أسئلة</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Forms View */}
        {activeView === "forms" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">نماذجي</h2>
                <p className="text-slate-500 mt-1">جميع نماذج Microsoft Forms المضافة</p>
              </div>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-l from-blue-600 to-violet-600 hover:opacity-90 gap-2 shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4" />
                إضافة نموذج
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="البحث في النماذج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-11 h-12 bg-white shadow-sm border-slate-200"
              />
            </div>

            {/* Forms Grid */}
            {filteredForms.length === 0 ? (
              <Card className="p-16 text-center bg-white border-0 shadow-lg">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد نماذج</h3>
                <p className="text-slate-500 mb-6">ابدأ بإضافة رابط Microsoft Forms</p>
                <Button onClick={() => setShowAddModal(true)} size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة نموذج
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredForms.map((form) => (
                  <FormCard
                    key={form.id}
                    form={form}
                    onQRClick={() => openQRModal(form)}
                    onDelete={() => handleDeleteForm(form.id)}
                    categoryColors={categoryColors}
                    categoryBadgeColors={categoryBadgeColors}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics View Placeholder */}
        {activeView === "analytics" && (
          <div className="flex items-center justify-center h-[60vh]">
            <Card className="p-16 text-center bg-white border-0 shadow-lg max-w-md">
              <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">التحليلات قريباً</h3>
              <p className="text-slate-500">سيتم ربط Power BI لعرض تحليلات متقدمة</p>
            </Card>
          </div>
        )}
      </main>

      {/* Template Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">إنشاء نموذج جديد</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6 pt-4">
              {/* Template Info */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className={`w-12 h-12 ${categoryColors[selectedTemplate.category]} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                  {templateIcons[selectedTemplate.icon]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{selectedTemplate.title}</h4>
                  <p className="text-sm text-slate-500">{selectedTemplate.description}</p>
                </div>
              </div>

              {/* Form Name Input */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">اسم النموذج</Label>
                <Input
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  placeholder="أدخل اسم النموذج الجديد"
                  className="h-12"
                />
              </div>

              {/* Questions Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">الأسئلة المقترحة</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyQuestions}
                    className="gap-2"
                  >
                    {copiedQuestions ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        نسخ الأسئلة
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2">
                  {selectedTemplate.questions.map((q, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-slate-700">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  خطوات الإنشاء
                </h5>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>انسخ الأسئلة أعلاه</li>
                  <li>اضغط على {"\"إنشاء في Microsoft Forms\""}</li>
                  <li>أنشئ نموذجاً جديداً باسم: <strong>{newFormName}</strong></li>
                  <li>أضف الأسئلة المنسوخة</li>
                  <li>عد إلى هنا وأضف رابط النموذج</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleGenerateForm}
                  className="flex-1 h-12 bg-gradient-to-l from-blue-600 to-violet-600 gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  إنشاء في Microsoft Forms
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTemplateModal(false)
                    setShowAddModal(true)
                  }}
                  className="flex-1 h-12"
                >
                  لدي رابط جاهز
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

// Form Card Component
function FormCard({ 
  form, 
  onQRClick, 
  onDelete,
  categoryColors,
  categoryBadgeColors
}: { 
  form: MSForm
  onQRClick: () => void
  onDelete: () => void
  categoryColors: Record<string, string>
  categoryBadgeColors: Record<string, string>
}) {
  const categoryIcons: Record<string, React.ReactNode> = {
    "تقييم دورات": <GraduationCap className="w-5 h-5 text-white" />,
    "رضا العملاء": <Smile className="w-5 h-5 text-white" />,
    "استطلاع موظفين": <Users className="w-5 h-5 text-white" />,
    "ورش عمل": <Wrench className="w-5 h-5 text-white" />,
    "فعاليات": <Calendar className="w-5 h-5 text-white" />,
    "أخرى": <FolderOpen className="w-5 h-5 text-white" />,
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
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
                <DropdownMenuItem onClick={onQRClick}>
                  <QrCode className="w-4 h-4 ml-2" />
                  عرض QR Code
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900">{form.title}</h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
            {form.description || "لا يوجد وصف"}
          </p>

          <div className="flex items-center justify-between mb-5">
            <Badge className={categoryBadgeColors[form.category] || "bg-slate-100 text-slate-700"}>
              {form.category}
            </Badge>
            <span className="text-sm font-medium text-slate-500">
              {form.responsesCount} رد
            </span>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={onQRClick} 
              className="flex-1 gap-2 bg-gradient-to-l from-blue-600 to-violet-600"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open(form.formUrl, "_blank")}
              className="flex-1 gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              فتح
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
