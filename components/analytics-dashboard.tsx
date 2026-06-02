"use client"

import { SurveyForm } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
} from "recharts"
import { Users, FileText, TrendingUp, CheckCircle } from "lucide-react"

interface AnalyticsDashboardProps {
  forms: SurveyForm[]
}

const COLORS = ["#d946ef", "#0ea5e9", "#22c55e", "#f59e0b", "#6366f1"]

export function AnalyticsDashboard({ forms }: AnalyticsDashboardProps) {
  const totalResponses = forms.reduce((acc, form) => acc + form.responses, 0)
  const totalForms = forms.filter((f) => !f.isTemplate).length
  const avgResponseRate = totalForms > 0 ? Math.round(totalResponses / totalForms) : 0

  // Category distribution
  const categoryData = forms
    .filter((f) => !f.isTemplate)
    .reduce((acc, form) => {
      const existing = acc.find((item) => item.name === form.category)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: form.category, value: 1 })
      }
      return acc
    }, [] as { name: string; value: number }[])

  // Response distribution by form
  const responseData = forms
    .filter((f) => !f.isTemplate && f.responses > 0)
    .slice(0, 6)
    .map((form) => ({
      name: form.title.length > 15 ? form.title.substring(0, 15) + "..." : form.title,
      responses: form.responses,
    }))

  // Simulated weekly trend data
  const trendData = [
    { day: "السبت", responses: 12 },
    { day: "الأحد", responses: 19 },
    { day: "الاثنين", responses: 15 },
    { day: "الثلاثاء", responses: 25 },
    { day: "الأربعاء", responses: 22 },
    { day: "الخميس", responses: 30 },
    { day: "الجمعة", responses: 18 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الاستبيانات</p>
              <p className="text-2xl font-bold">{totalForms}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الردود</p>
              <p className="text-2xl font-bold">{totalResponses}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متوسط الردود</p>
              <p className="text-2xl font-bold">{avgResponseRate}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">معدل الإكمال</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">اتجاه الردود الأسبوعي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">توزيع التصنيفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  لا توجد بيانات كافية
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Response by Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">الردود حسب الاستبيان</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {responseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar 
                      dataKey="responses" 
                      fill="hsl(var(--accent))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  لا توجد ردود بعد
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
