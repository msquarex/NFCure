"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, Scan, Upload, AlertTriangle, CheckCircle, Camera } from "lucide-react"

interface ScanResult {
  type: "retina" | "skin"
  condition: string
  risk: "low" | "mild" | "high"
  confidence: number
  details: string
  recommendations: string[]
  classProbabilities?: Record<string, number>
}

export default function VisionScanPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [results, setResults] = useState<ScanResult[]>([])

  const API_BASE = "http://127.0.0.1:8000"

  const handleFileSelect = (scanType: "retina" | "skin") => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (file) {
        await analyzeImage(file, scanType)
      }
    }
    input.click()
  }

  const analyzeImage = async (file: File, scanType: "retina" | "skin") => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 150)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const endpoint =
        scanType === "retina" ? "/predict/retina/" : "/predict/skin/"

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (scanType === "retina") {
        const risk =
          data.prediction === "No DR"
            ? "low"
            : data.prediction === "Mild"
            ? "mild"
            : "high"; // default to high risk


        const mappedResult: ScanResult = {
          type: "retina",
          condition: data.prediction,
          risk,
          confidence: data.confidence,
          details: `AI detected ${data.prediction}. Please consult an ophthalmologist for confirmation.`,
          recommendations:
            risk === "low"
              ? ["Continue regular eye check-ups", "Maintain healthy lifestyle"]
              : [
                  "Consult ophthalmologist",
                  "Follow doctor’s prescribed treatment",
                  "Regular monitoring required",
                ],
          classProbabilities: data.class_probabilities,
        }
        setResults([mappedResult])
      } else {
        let risk: "low" | "mild" | "high" = "low"
        if (data.confidence > 70) {
          if (
            ["Melanoma", "Basal cell carcinoma"].includes(data.prediction)
          )
            risk = "high"
          else if (["Actinic keratoses"].includes(data.prediction))
            risk = "mild"
        }

        const mappedResult: ScanResult = {
          type: "skin",
          condition: data.prediction,
          risk,
          confidence: data.confidence,
          details: `AI detected possible ${data.prediction}. Please consult a dermatologist.`,
          recommendations:
            risk === "low"
              ? ["Routine self-checks", "Maintain skin health"]
              : risk === "mild"
              ? ["Consult dermatologist", "Monitor skin regularly"]
              : [
                  "Urgent dermatologist consultation",
                  "Early treatment is highly recommended",
                ],
          classProbabilities: data.class_probabilities,
        }
        setResults([mappedResult])
      }
    } catch (error) {
      console.error("Prediction error:", error)
    } finally {
      clearInterval(progressInterval)
      setAnalysisProgress(100)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-orbitron text-5xl font-bold gradient-text-holographic mb-4">
            Vision Scan Analysis
          </h1>
          <p className="text-slate-700 text-xl">
            Advanced retina and skin scanning with AI-powered analysis
          </p>
        </div>

        {/* Upload Options */}
        <div className="flex justify-center space-x-12 mb-12">
          <div
            className="cursor-pointer flex flex-col items-center"
            onClick={() => handleFileSelect("retina")}
          >
            <Eye className="w-16 h-16 text-blue-600 mb-2" />
            <p className="text-slate-700 font-semibold">Retina Scan</p>
          </div>
          <div
            className="cursor-pointer flex flex-col items-center"
            onClick={() => handleFileSelect("skin")}
          >
            <Camera className="w-16 h-16 text-purple-600 mb-2" />
            <p className="text-slate-700 font-semibold">Skin Scan</p>
          </div>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-semibold text-lg">
                Analyzing image...
              </span>
              <span className="text-blue-600 font-bold text-lg">
                {analysisProgress}%
              </span>
            </div>
            <Progress value={analysisProgress} className="h-4 rounded-full" />
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            {results.map((result, index) => (
              <Card key={index} className="glass border-gray-300 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center">
                      {result.type === "retina" ? (
                        <Eye className="mr-2 w-5 h-5 text-blue-600" />
                      ) : (
                        <Camera className="mr-2 w-5 h-5 text-purple-600" />
                      )}
                      {result.type === "retina"
                        ? "Retina Analysis"
                        : "Skin Analysis"}
                    </div>
                    <Badge
                      className={`${
                        result.risk === "low"
                          ? "bg-green-100 text-green-600"
                          : result.risk === "mild"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {result.risk.toUpperCase()} RISK
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 font-semibold">{result.condition}</p>
                  <p className="text-sm text-gray-600 mb-3">{result.details}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Confidence: {result.confidence.toFixed(2)}%
                  </p>
                  <h4 className="font-semibold mb-1">Recommendations:</h4>
                  <ul className="list-disc ml-6 text-sm text-gray-700">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                  {result.classProbabilities && (
                    <div className="mt-3">
                      <h4 className="font-semibold">Class Probabilities:</h4>
                      <ul className="list-disc ml-6 text-sm text-gray-700">
                        {Object.entries(result.classProbabilities).map(
                          ([cls, prob], i) => (
                            <li key={i}>
                              {cls}: {prob.toFixed(2)}%
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
