"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, Scan, Upload, AlertTriangle, CheckCircle, Camera, FileImage, Brain } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface ScanResult {
  type: "retina" | "skin"
  condition: string
  risk: "low" | "mild" | "high"
  confidence: number
  details: string
  recommendations: string[]
}

export default function VisionScanPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [results, setResults] = useState<ScanResult[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".bmp"],
    },
    multiple: true,
  })

  const analyzeImages = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 5
      })
    }, 150)

    try {
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append("file", file)
      })

      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      // ---- Mapping API → frontend ----
      let risk: "low" | "mild" | "high" = "high"
      if (data.prediction === "No DR") {
        risk = "low"
      } else if (data.prediction === "Mild") {
        risk = "mild"
      } else if (data.prediction === "Moderate") {
        risk = "high"
      } else {
        risk = "high"
      }

      const mappedResult: ScanResult = {
        type: "retina",
        condition: data.prediction,
        risk: risk,
        confidence: Math.floor(Math.random() * 10) + 90, // mock confidence %
        details: `AI detected: ${data.prediction}. Please consult an ophthalmologist for confirmation.`,
        recommendations:
          data.prediction === "No DR"
            ? ["Continue regular eye check-ups", "Maintain healthy lifestyle"]
            : [
                "Consult ophthalmologist",
                "Follow doctor’s prescribed treatment",
                "Regular monitoring required",
              ],
      }

      setResults([mappedResult])
    } catch (error) {
      console.error("Prediction error:", error)
    } finally {
      clearInterval(interval)
      setAnalysisProgress(100)
      setIsAnalyzing(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-50/20 to-cyan-100/30 animate-aurora"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-orbitron text-5xl font-bold gradient-text-holographic mb-4 animate-slide-in-up">
            Vision Scan Analysis
          </h1>
          <p
            className="text-slate-700 text-xl animate-slide-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Advanced retina and skin scanning with AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="glass rounded-3xl border-0 glow-blue animate-slide-in-up">
              <CardHeader className="pb-6">
                <CardTitle className="font-orbitron gradient-text-primary flex items-center text-xl">
                  <Upload className="mr-3 w-6 h-6" />
                  Upload Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500
                    ${
                      isDragActive
                        ? "border-blue-500 bg-blue-50/50 glow-blue"
                        : "border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 hover:glow-blue"
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-6">
                      <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-soft">
                        <Eye className="w-10 h-10 text-white" />
                      </div>
                      <div
                        className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse-soft"
                        style={{ animationDelay: "0.5s" }}
                      >
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {isDragActive ? (
                      <p className="text-blue-600 font-semibold text-xl">
                        Drop the images here...
                      </p>
                    ) : (
                      <div>
                        <p className="text-slate-800 font-semibold mb-3 text-xl">
                          Drag & drop retina or skin images here
                        </p>
                        <p className="text-slate-600 text-lg">
                          or click to select files (JPEG, PNG, BMP)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-semibold text-slate-800 text-lg">
                      Uploaded Files:
                    </h4>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl border border-slate-300/50 hover:scale-105 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <FileImage className="w-6 h-6 text-blue-600" />
                          <span className="text-slate-700 font-medium">
                            {file.name}
                          </span>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Analyze Button */}
                {uploadedFiles.length > 0 && !isAnalyzing && results.length === 0 && (
                  <Button
                    onClick={analyzeImages}
                    className="w-full mt-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 text-xl rounded-full transition-all duration-500 transform hover:scale-105 glow-rainbow shadow-2xl"
                  >
                    <Scan className="mr-3 w-6 h-6" />
                    Analyze Images
                  </Button>
                )}

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold text-lg">
                        Analyzing images...
                      </span>
                      <span className="text-blue-600 font-bold text-lg">
                        {analysisProgress}%
                      </span>
                    </div>
                    <Progress value={analysisProgress} className="h-4 rounded-full" />
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Brain className="w-5 h-5 animate-pulse text-blue-600" />
                      <span className="font-medium">
                        AI models processing visual data...
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results.length > 0 && (
              <>
                {results.map((result, index) => (
                  <Card key={index} className="glass border-[#00C2FF]/30">
                    <CardHeader>
                      <CardTitle className="font-orbitron text-[#00C2FF] flex items-center justify-between">
                        <div className="flex items-center">
                          {result.type === "retina" ? (
                            <Eye className="mr-2 w-5 h-5" />
                          ) : (
                            <Camera className="mr-2 w-5 h-5" />
                          )}
                          {result.type === "retina"
                            ? "Retina Analysis"
                            : "Skin Analysis"}
                        </div>
                        <Badge
                          className={`
                            ${result.risk === "low" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                            ${result.risk === "mild" ? "bg-yellow-400/20 text-yellow-500 border-yellow-400/30" : ""}
                            ${result.risk === "high" ? "bg-red-500/20 text-red-400 border-red-500/30" : ""}
                          `}
                        >
                          {result.risk.toUpperCase()} RISK
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          {result.condition}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {result.details}
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-400">
                            Confidence Level
                          </span>
                          <span className="text-[#00F5D4]">
                            {result.confidence}%
                          </span>
                        </div>
                        <Progress value={result.confidence} className="h-2" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          {result.risk === "low" ? (
                            <CheckCircle className="mr-2 w-4 h-4 text-green-400" />
                          ) : result.risk === "mild" ? (
                            <AlertTriangle className="mr-2 w-4 h-4 text-yellow-400" />
                          ) : (
                            <AlertTriangle className="mr-2 w-4 h-4 text-red-400" />
                          )}
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, recIndex) => (
                            <li
                              key={recIndex}
                              className="flex items-start text-sm text-gray-300"
                            >
                              <CheckCircle className="mr-2 w-4 h-4 text-[#00F5D4] mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {results.length === 0 && !isAnalyzing && (
              <Card className="glass border-gray-700/50">
                <CardContent className="p-12 text-center">
                  <div className="mb-4">
                    <Scan className="w-16 h-16 text-gray-500 mx-auto" />
                  </div>
                  <h3 className="font-orbitron text-xl text-gray-400 mb-2">
                    No Analysis Results
                  </h3>
                  <p className="text-gray-500">
                    Upload images to begin vision scan analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
