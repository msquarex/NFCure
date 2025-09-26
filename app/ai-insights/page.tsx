"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Activity, Heart, Calculator } from "lucide-react"
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

interface PredictionResult {
  prediction: number
  probability: number
}

function CardioRiskForm({ onResult }: { onResult: (result: PredictionResult) => void }) {
  const [formData, setFormData] = useState({
    General_Health: "Good",
    Checkup: "Within the past year",
    Exercise: "Yes",
    Skin_Cancer: "No",
    Other_Cancer: "No",
    Diabetes: "Yes",
    Arthritis: "No",
    Age_Category: "65-69",
    Height_cm: 175,
    Weight_kg: 62,
    BMI: 20.2,
    Smoking_History: "No",
    Alcohol_Consumption: 0,
    Fruit_Consumption: 2,
    Green_Vegetables_Consumption: 2,
    FriedPotato_Consumption: 1,
    Sex: "Male",
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const numericFields = ["Height_cm", "Weight_kg", "BMI", "Alcohol_Consumption", "Fruit_Consumption", "Green_Vegetables_Consumption", "FriedPotato_Consumption"]
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }))

    // Auto-calculate BMI when height or weight changes
    if (name === "Height_cm" || name === "Weight_kg") {
      const height = name === "Height_cm" ? parseFloat(value) : formData.Height_cm
      const weight = name === "Weight_kg" ? parseFloat(value) : formData.Weight_kg
      const bmi = weight / ((height / 100) ** 2)
      setFormData(prev => ({ ...prev, BMI: parseFloat(bmi.toFixed(1)) }))
    }
  }

  async function handleSubmit() {
    setLoading(true)
    
    try {
      console.log("Sending request to:", "http://127.0.0.1:5000/predict")
      console.log("Form data:", formData)
      
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Response error:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log("Received result:", result)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      onResult(result)
      
    } catch (error) {
      console.error("Prediction error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cardiovascular Risk Assessment</h3>
        <p className="text-slate-600">Enter your health information for AI-powered risk analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">General Health</label>
          <select 
            name="General_Health" 
            value={formData.General_Health} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Poor</option>
            <option>Fair</option>
            <option>Good</option>
            <option>Very Good</option>
            <option>Excellent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Age Category</label>
          <select 
            name="Age_Category" 
            value={formData.Age_Category} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>18-24</option>
            <option>25-29</option>
            <option>30-34</option>
            <option>35-39</option>
            <option>40-44</option>
            <option>45-49</option>
            <option>50-54</option>
            <option>55-59</option>
            <option>60-64</option>
            <option>65-69</option>
            <option>70-74</option>
            <option>75-79</option>
            <option>80+</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Height (cm)</label>
          <input 
            type="number" 
            name="Height_cm" 
            value={formData.Height_cm} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Weight (kg)</label>
          <input 
            type="number" 
            name="Weight_kg" 
            value={formData.Weight_kg} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">BMI (auto-calculated)</label>
          <input 
            type="number" 
            name="BMI" 
            value={formData.BMI} 
            readOnly
            className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-600"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Sex</label>
          <select 
            name="Sex" 
            value={formData.Sex} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Exercise Regularly</label>
          <select 
            name="Exercise" 
            value={formData.Exercise} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Smoking History</label>
          <select 
            name="Smoking_History" 
            value={formData.Smoking_History} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Diabetes</label>
          <select 
            name="Diabetes" 
            value={formData.Diabetes} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>No</option>
            <option>Yes</option>
            <option>Pre-diabetes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Checkup Frequency</label>
          <select 
            name="Checkup" 
            value={formData.Checkup} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Never</option>
            <option>Within the past year</option>
            <option>Within the past 2 years</option>
            <option>Within the past 5 years</option>
            <option>5 or more years ago</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Skin Cancer History</label>
          <select 
            name="Skin_Cancer" 
            value={formData.Skin_Cancer} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Other Cancer History</label>
          <select 
            name="Other_Cancer" 
            value={formData.Other_Cancer} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Arthritis</label>
          <select 
            name="Arthritis" 
            value={formData.Arthritis} 
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Alcohol Consumption (drinks/week)</label>
          <input 
            type="number" 
            name="Alcohol_Consumption" 
            value={formData.Alcohol_Consumption} 
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Fried Potato Consumption (servings/week)</label>
          <input 
            type="number" 
            name="FriedPotato_Consumption" 
            value={formData.FriedPotato_Consumption} 
            onChange={handleChange}
            min="0"
            max="20"
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Fruit Consumption (servings/day)</label>
          <input 
            type="number" 
            name="Fruit_Consumption" 
            value={formData.Fruit_Consumption} 
            onChange={handleChange}
            min="0"
            max="10"
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Green Vegetables (servings/day)</label>
          <input 
            type="number" 
            name="Green_Vegetables_Consumption" 
            value={formData.Green_Vegetables_Consumption} 
            onChange={handleChange}
            min="0"
            max="10"
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2 mt-6">
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Calculator className="mr-3 w-5 h-5" />
                Predict Cardiovascular Risk
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function PredictionResults({ result }: { result: PredictionResult }) {
  const riskLevel = result.prediction === 1 ? "High Risk" : "Low Risk"
  const riskColor = result.prediction === 1 ? "text-red-600" : "text-green-600"
  const bgColor = result.prediction === 1 ? "from-red-50 to-orange-50 border-red-200" : "from-green-50 to-emerald-50 border-green-200"

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-3xl bg-gradient-to-r ${bgColor} border`}>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Risk Assessment Results</h3>
          <div className={`text-4xl font-bold ${riskColor} mb-2`}>
            {riskLevel}
          </div>
          <div className="text-lg text-slate-600">
            Risk Probability: <span className="font-semibold">{result.probability}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="mr-3 w-5 h-5 text-orange-500" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              <p>• Age and cardiovascular health correlation</p>
              <p>• Lifestyle and dietary factors</p>
              <p>• Medical history considerations</p>
              <p>• BMI and physical activity levels</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="mr-3 w-5 h-5 text-green-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              <p>• Regular cardiovascular screening</p>
              <p>• Maintain healthy diet and exercise</p>
              <p>• Monitor blood pressure regularly</p>
              <p>• Consult healthcare provider</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-50/20 to-cyan-100/30"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            AI Health Insights
          </h1>
          <p className="text-slate-700 text-xl">
            Advanced machine learning analysis of your health data
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
            <Button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-800 bg-transparent"
              }`}
            >
              <BarChart3 className="mr-2 w-5 h-5" />
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab("cardiovascular")}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ml-2 ${
                activeTab === "cardiovascular"
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-800 bg-transparent"
              }`}
            >
              <Heart className="mr-2 w-5 h-5" />
              Cardiovascular Risk
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Model Outputs */}
            <div className="space-y-6">
              {/* Health Trends Chart */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center text-xl">
                    <TrendingUp className="mr-3 w-6 h-6 text-blue-600" />
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
              <Card className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent flex items-center text-xl">
                    <BarChart3 className="mr-3 w-6 h-6 text-purple-600" />
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
            </div>

            {/* Right Column - AI Analysis */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center text-xl">
                    <Brain className="mr-3 w-6 h-6 text-blue-600" />
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
                      readings have gradually increased over the past 6 months.
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
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "cardiovascular" && (
          <Card className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 shadow-xl max-w-4xl mx-auto">
            <CardHeader className="pb-6">
              <CardTitle className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center text-2xl justify-center">
                <Heart className="mr-3 w-8 h-8 text-red-600" />
                Cardiovascular Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!predictionResult ? (
                <CardioRiskForm onResult={setPredictionResult} />
              ) : (
                <div className="space-y-6">
                  <PredictionResults result={predictionResult} />
                  <div className="text-center">
                    <Button
                      onClick={() => setPredictionResult(null)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl"
                    >
                      Run Another Assessment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}