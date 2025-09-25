"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Activity, Heart } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const healthTrends = [
  { month: "Jan", bp: 118, hr: 70, sugar: 92 },
  { month: "Feb", bp: 120, hr: 72, sugar: 95 },
  { month: "Mar", bp: 122, hr: 74, sugar: 98 },
  { month: "Apr", bp: 125, hr: 76, sugar: 102 },
  { month: "May", bp: 128, hr: 78, sugar: 105 },
  { month: "Jun", bp: 130, hr: 80, sugar: 108 },
]

const riskData = [
  { name: "Low Risk", value: 65, color: "#3b82f6" },
  { name: "Medium Risk", value: 25, color: "#8b5cf6" },
  { name: "High Risk", value: 10, color: "#06b6d4" },
]

const predictions = [
  {
    condition: "Hypertension Risk",
    probability: 78,
    trend: "increasing",
    timeframe: "6 months",
    confidence: 92,
    status: "warning",
  },
  {
    condition: "Diabetes Risk",
    probability: 23,
    trend: "stable",
    timeframe: "12 months",
    confidence: 87,
    status: "normal",
  },
  {
    condition: "Cardiovascular Risk",
    probability: 15,
    trend: "decreasing",
    timeframe: "24 months",
    confidence: 94,
    status: "good",
  },
]

export default function AIInsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Stunning Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-50/20 to-cyan-100/30 animate-aurora"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-orbitron text-5xl font-bold gradient-text-holographic mb-4 animate-slide-in-up">
            AI Health Insights
          </h1>
          <p className="text-slate-700 text-xl animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Advanced machine learning analysis of your health data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Model Outputs */}
          <div className="space-y-6">
            {/* Health Trends Chart */}
            <Card className="glass rounded-3xl border-0 glow-blue animate-slide-in-up">
              <CardHeader className="pb-6">
                <CardTitle className="font-orbitron gradient-text-primary flex items-center text-xl">
                  <TrendingUp className="mr-3 w-6 h-6" />
                  Health Trends Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #3b82f6",
                          borderRadius: "12px",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line type="monotone" dataKey="bp" stroke="#3b82f6" strokeWidth={3} name="Blood Pressure" />
                      <Line type="monotone" dataKey="hr" stroke="#8b5cf6" strokeWidth={3} name="Heart Rate" />
                      <Line type="monotone" dataKey="sugar" stroke="#06b6d4" strokeWidth={3} name="Blood Sugar" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="glass rounded-3xl border-0 glow-purple animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-6">
                <CardTitle className="font-orbitron gradient-text-secondary flex items-center text-xl">
                  <BarChart3 className="mr-3 w-6 h-6" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {riskData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-slate-700">
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prediction Models */}
            <Card className="glass rounded-3xl border-0 glow-cyan animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="pb-6">
                <CardTitle className="font-orbitron gradient-text-accent flex items-center text-xl">
                  <Brain className="mr-3 w-6 h-6" />
                  Predictive Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-gradient-to-r from-slate-100/50 to-slate-200/50 border border-slate-300/50 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-800 text-lg">{prediction.condition}</h4>
                      <Badge
                        className={`
                        ${prediction.status === "warning" ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0" : ""}
                        ${prediction.status === "normal" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0" : ""}
                        ${prediction.status === "good" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" : ""}
                      `}
                      >
                        {prediction.probability}% risk
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Confidence Level</span>
                        <span className="text-blue-600 font-semibold">{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />

                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-slate-600">Timeframe: {prediction.timeframe}</span>
                        <span
                          className={`
                          ${prediction.trend === "increasing" ? "text-red-600 font-semibold" : ""}
                          ${prediction.trend === "stable" ? "text-yellow-600 font-semibold" : ""}
                          ${prediction.trend === "decreasing" ? "text-green-600 font-semibold" : ""}
                        `}
                        >
                          {prediction.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - LLM Context Panel */}
          <div className="space-y-6">
            {/* Doctor's Summary */}
            <Card className="glass rounded-3xl border-0 glow-blue animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader className="pb-6">
                <CardTitle className="font-orbitron gradient-text-primary flex items-center text-xl">
                  <Brain className="mr-3 w-6 h-6 animate-pulse" />
                  AI Doctor Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50">
                  <h4 className="font-semibold text-blue-700 mb-3 flex items-center text-lg">
                    <AlertTriangle className="mr-3 w-5 h-5" />
                    Primary Concern
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Patient shows early signs of hypertension risk based on vitals and historical trends. Blood pressure
                    readings have gradually increased over the past 6 months, with current systolic readings approaching
                    stage 1 hypertension threshold.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200/50">
                  <h4 className="font-semibold text-purple-700 mb-3 flex items-center text-lg">
                    <Activity className="mr-3 w-5 h-5" />
                    Recommendations
                  </h4>
                  <ul className="text-slate-700 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      Implement daily 30-minute moderate exercise routine
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      Reduce sodium intake to less than 2,300mg per day
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      Schedule follow-up appointment within 4-6 weeks
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      Consider stress management techniques (meditation, yoga)
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/50">
                  <h4 className="font-semibold text-cyan-700 mb-3 flex items-center text-lg">
                    <Heart className="mr-3 w-5 h-5" />
                    Positive Indicators
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Blood sugar levels remain within normal range with good stability. Heart rate variability shows
                    healthy cardiovascular function. Overall metabolic markers suggest good baseline health with
                    preventive intervention potential.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Model Confidence Indicators */}
            <Card className="glass rounded-3xl border-0 glow-purple animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
              <CardHeader className="pb-6">
                <CardTitle className="font-orbitron gradient-text-secondary text-xl">Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600">Cardiovascular Model</span>
                      <span className="text-sm text-blue-600 font-semibold">94% Accuracy</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full animate-pulse-soft"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600">Diabetes Prediction</span>
                      <span className="text-sm text-purple-600 font-semibold">87% Accuracy</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full animate-pulse-soft"
                        style={{ width: "87%", animationDelay: "0.5s" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600">Hypertension Risk</span>
                      <span className="text-sm text-cyan-600 font-semibold">92% Accuracy</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full animate-pulse-soft"
                        style={{ width: "92%", animationDelay: "1s" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300/50">
                  <p className="text-sm text-slate-600 text-center font-medium">
                    Models trained on 50K+ patient records with continuous learning updates
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
