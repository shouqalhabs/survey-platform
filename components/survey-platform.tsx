"use client"

import { useState } from "react"
import { SurveyForm } from "@/lib/types"
import { formTemplates, generateId } from "@/lib/form-data"
import { FormBuilder } from "@/components/form-builder"
import { FormPreview } from "@/components/form-preview"
import { QRCodeModal } from "@/components/qr-code-modal"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Plus,
  Search,
  QrCode,
  Eye,
  Edit,
  MoreVertical,
  Trash2,
  Copy,
  Users,
  ClipboardList,
  ChevronLeft,
} from "lucide-react"

type ViewMode = "dashboard" | "templates" | "my-forms" | "analytics" | "builder" | "preview"

export function SurveyPlatform() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard")
  const [forms, setForms] = useState<SurveyForm[]>([
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
  ])
  const [selectedForm, setSelectedForm] = useState<SurveyForm | null>(null)
  const [editingForm, setEditingForm] = useState<SurveyForm | null>(null)
  const [qrModal, setQrModal] = useState<{ open: boolean; formId: string; formTitle: string }>({
    open: false,
    formId: "",
    formTitle: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [previewSheet, setPreviewSheet] = useState(false)

  const handleCreateFromTemplate = (template: SurveyForm) => {
    setEditingForm({
      ...template,
      id: "",
      isTemplate: false,
    })
    setViewMode("builder")
  }

  const handleCreateNew = () => {
    setEditingForm(null)
    setViewMode("builder")
  }

  const handleSaveForm = (formData: Omit<SurveyForm, "id" | "responses" | "createdAt">) => {
    if (editingForm?.id) {
      // Update existing
      setForms(
        forms.map((f) =>
          f.id === editingForm.id
            ? { ...f, ...formData }
            : f
        )
      )
    } else {
      // Create new
      const newForm: SurveyForm = {
        ...formData,
        id: generateId(),
        responses: 0,
        createdAt: new Date().toISOString(),
      }
      setForms([newForm, ...forms])
    }
    setEditingForm(null)
    setViewMode("my-forms")
  }

  const handleDeleteForm = (formId: string) => {
    setForms(forms.filter((f) => f.id !== formId))
  }

  const handleDuplicateForm = (form: SurveyForm) => {
    const newForm: SurveyForm = {
      ...form,
      id: generateId(),
      title: `${form.title} (نسخة)`,
      responses: 0,
      createdAt: new Date().toISOString(),
    }
    setForms([newForm, ...forms])
  }

  const filteredForms = forms.filter(
    (f) =>
      f.title.includes(searchQuery) ||
      f.description.includes(searchQuery) ||
      f.category.includes(searchQuery)
  )

  const filteredTemplates = formTemplates.filter(
    (t) =>
      t.title.includes(searchQuery) ||
      t.description.includes(searchQuery) ||
      t.category.includes(searchQuery)
  )

  const totalResponses = forms.reduce((acc, f) => acc + f.responses, 0)

  // Sidebar Navigation
  const NavItem = ({
    icon: Icon,
    label,
    view,
    badge,
  }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    view: ViewMode
    badge?: number
  }) => (
    <button
      onClick={() => setViewMode(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        viewMode === view
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-right">{label}</span>
      {badge !== undefined && (
        <Badge variant="secondary" className="bg-sidebar-primary text-sidebar-primary-foreground">
          {badge}
        </Badge>
      )}
    </button>
  )

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-l border-sidebar-border p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-sidebar-primary" />
            استبيان
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">منصة استطلاعات الرأي</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={LayoutDashboard} label="لوحة التحكم" view="dashboard" />
          <NavItem icon={FileText} label="النماذج الجاهزة" view="templates" badge={formTemplates.length} />
          <NavItem icon={ClipboardList} label="استبياناتي" view="my-forms" badge={forms.length} />
          <NavItem icon={BarChart3} label="التحليلات" view="analytics" />
        </nav>

        <div className="pt-4 border-t border-sidebar-border">
          <Button onClick={handleCreateNew} className="w-full" size="lg">
            <Plus className="w-4 h-4 ml-2" />
            استبيان جديد
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {viewMode === "dashboard" && (
          <div className="space-y-6 max-w-6xl">
            <div>
              <h2 className="text-2xl font-bold">مرحباً بك!</h2>
              <p className="text-muted-foreground">إليك نظرة عامة على استبياناتك</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">استبياناتي</p>
                    <p className="text-3xl font-bold">{forms.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الردود</p>
                    <p className="text-3xl font-bold">{totalResponses}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-success/5 border-success/20">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">نماذج جاهزة</p>
                    <p className="text-3xl font-bold">{formTemplates.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Forms */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>آخر الاستبيانات</CardTitle>
                  <CardDescription>استبياناتك الأخيرة</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setViewMode("my-forms")}>
                  عرض الكل
                  <ChevronLeft className="w-4 h-4 mr-2" />
                </Button>
              </CardHeader>
              <CardContent>
                {forms.length > 0 ? (
                  <div className="space-y-3">
                    {forms.slice(0, 3).map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{form.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {form.responses} رد
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setQrModal({ open: true, formId: form.id, formTitle: form.title })
                            }
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedForm(form)
                              setPreviewSheet(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>لم تقم بإنشاء أي استبيانات بعد</p>
                    <Button onClick={handleCreateNew} variant="link" className="mt-2">
                      إنشاء استبيان جديد
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle>ابدأ بسرعة</CardTitle>
                <CardDescription>اختر نموذج جاهز وابدأ فوراً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formTemplates.slice(0, 3).map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => handleCreateFromTemplate(template)}
                    >
                      <CardContent className="pt-6">
                        <Badge variant="secondary" className="mb-2">
                          {template.category}
                        </Badge>
                        <h4 className="font-medium mb-1">{template.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {template.questions.length} أسئلة
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === "templates" && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">النماذج الجاهزة</h2>
                <p className="text-muted-foreground">اختر نموذج واستخدمه مباشرة</p>
              </div>
              <div className="relative w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في النماذج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="تعليم">تعليم</TabsTrigger>
                <TabsTrigger value="خدمات">خدمات</TabsTrigger>
                <TabsTrigger value="موارد بشرية">موارد بشرية</TabsTrigger>
                <TabsTrigger value="فعاليات">فعاليات</TabsTrigger>
                <TabsTrigger value="تسويق">تسويق</TabsTrigger>
              </TabsList>

              {["all", "تعليم", "خدمات", "موارد بشرية", "فعاليات", "تسويق"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(tab === "all"
                      ? filteredTemplates
                      : filteredTemplates.filter((t) => t.category === tab)
                    ).map((template) => (
                      <Card key={template.id} className="hover:border-primary/50 transition-colors">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary">{template.category}</Badge>
                          </div>
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {template.questions.length} أسئلة
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleCreateFromTemplate(template)}
                              className="flex-1"
                            >
                              استخدام النموذج
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedForm(template)
                                setPreviewSheet(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {viewMode === "my-forms" && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">استبياناتي</h2>
                <p className="text-muted-foreground">إدارة جميع استبياناتك</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-72">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 ml-2" />
                  استبيان جديد
                </Button>
              </div>
            </div>

            {filteredForms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredForms.map((form) => (
                  <Card key={form.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">{form.category}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingForm(form)
                                setViewMode("builder")
                              }}
                            >
                              <Edit className="w-4 h-4 ml-2" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateForm(form)}>
                              <Copy className="w-4 h-4 ml-2" />
                              نسخ
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteForm(form.id)}
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{form.title}</CardTitle>
                      <CardDescription>{form.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {form.responses} رد
                        </span>
                        <span>{form.questions.length} أسئلة</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            setQrModal({ open: true, formId: form.id, formTitle: form.title })
                          }
                        >
                          <QrCode className="w-4 h-4 ml-2" />
                          QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedForm(form)
                            setPreviewSheet(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ClipboardList className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">لا توجد استبيانات</h3>
                  <p className="text-muted-foreground mb-4">
                    ابدأ بإنشاء استبيان جديد أو استخدم نموذج جاهز
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateNew}>
                      <Plus className="w-4 h-4 ml-2" />
                      استبيان جديد
                    </Button>
                    <Button variant="outline" onClick={() => setViewMode("templates")}>
                      استعراض النماذج
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {viewMode === "analytics" && (
          <div className="space-y-6 max-w-6xl">
            <div>
              <h2 className="text-2xl font-bold">التحليلات</h2>
              <p className="text-muted-foreground">
                تحليل شامل لبيانات استبياناتك (يمكن ربطها مع Power BI)
              </p>
            </div>
            <AnalyticsDashboard forms={forms} />
          </div>
        )}

        {viewMode === "builder" && (
          <div className="max-w-4xl">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingForm(null)
                  setViewMode("my-forms")
                }}
              >
                <ChevronLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
            </div>
            <h2 className="text-2xl font-bold mb-6">
              {editingForm?.id ? "تعديل الاستبيان" : "إنشاء استبيان جديد"}
            </h2>
            <FormBuilder
              initialForm={editingForm || undefined}
              onSave={handleSaveForm}
              onCancel={() => {
                setEditingForm(null)
                setViewMode("my-forms")
              }}
            />
          </div>
        )}
      </main>

      {/* Preview Sheet */}
      <Sheet open={previewSheet} onOpenChange={setPreviewSheet}>
        <SheetContent className="w-full sm:max-w-2xl overflow-auto">
          <SheetHeader>
            <SheetTitle>معاينة الاستبيان</SheetTitle>
          </SheetHeader>
          {selectedForm && (
            <div className="mt-6">
              <FormPreview
                title={selectedForm.title}
                description={selectedForm.description}
                questions={selectedForm.questions}
                isPreview
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* QR Code Modal */}
      <QRCodeModal
        open={qrModal.open}
        onClose={() => setQrModal({ open: false, formId: "", formTitle: "" })}
        formId={qrModal.formId}
        formTitle={qrModal.formTitle}
      />
    </div>
  )
}
