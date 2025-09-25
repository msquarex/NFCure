"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Droplets, Thermometer, User, CreditCard, ArrowRight, Brain, Maximize2, Minimize2, RefreshCw } from "lucide-react"

export default function NFCTapPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
      setIsLoading(true)
    }
  }

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our NFC API
      if (event.origin !== 'https://10.78.77.25:3000') return
      
      if (event.data.type === 'nfc-connected') {
        setIsConnected(true)
      } else if (event.data.type === 'nfc-disconnected') {
        setIsConnected(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const vitalsData = [
    { label: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal", icon: Heart, color: "#3b82f6" },
    { label: "Heart Rate", value: "72", unit: "bpm", status: "normal", icon: Activity, color: "#8b5cf6" },
    { label: "SpO2", value: "98", unit: "%", status: "normal", icon: Droplets, color: "#06b6d4" },
    { label: "Blood Sugar", value: "95", unit: "mg/dL", status: "normal", icon: Droplets, color: "#3b82f6" },
    { label: "Temperature", value: "98.6", unit: "°F", status: "normal", icon: Thermometer, color: "#8b5cf6" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Stunning Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-50/20 to-cyan-100/30 animate-aurora"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
        {/* Header with Controls */}
        

        {/* NFC API Integration */}
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'mt-16'}`}>
          <div className={`${isFullscreen ? 'h-screen' : 'h-[80vh]'} relative rounded-3xl overflow-hidden glass border-0 glow-blue`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 z-10">
                <div className="text-center">
                  <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-dashed border-blue-500 animate-spin glow-blue mb-6">
                    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <CreditCard className="w-12 h-12 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold gradient-text-primary mb-2">Loading NFCure API...</h3>
                  <p className="text-slate-600">Establishing secure connection</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src="https://192.168.229.14:3000"
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title="NFCure NFC API"
              allow="nfc; camera; microphone; geolocation"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            />
          </div>
        </div>

        {isConnected && (
          /* Dashboard View */
          <div className="space-y-10">
            {/* Patient Profile Header */}
            <Card className="glass rounded-3xl border-0 glow-blue animate-slide-in-up">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-6">
                  <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-soft">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-orbitron gradient-text-primary mb-2">John Doe</CardTitle>
                    <p className="text-slate-600 text-lg">Patient ID: NFC-2024-001 | Age: 34</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 text-sm font-semibold animate-pulse-soft">
                    Connected
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vitalsData.map((vital, index) => {
                const IconComponent = vital.icon
                const colors = [
                  { bg: "from-blue-500 to-purple-500", glow: "glow-blue" },
                  { bg: "from-purple-500 to-cyan-500", glow: "glow-purple" },
                  { bg: "from-cyan-500 to-blue-500", glow: "glow-cyan" },
                  { bg: "from-blue-500 to-purple-500", glow: "glow-blue" },
                  { bg: "from-purple-500 to-cyan-500", glow: "glow-purple" }
                ]
                const colorSet = colors[index % colors.length]
                
                return (
                  <Card
                    key={vital.label}
                    className={`group glass rounded-3xl border-0 hover:scale-105 transition-all duration-500 ${colorSet.glow} animate-slide-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${colorSet.bg} group-hover:rotate-12 transition-all duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 text-sm font-semibold">
                          {vital.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-700 mb-3 text-lg">{vital.label}</h3>
                      <div className="flex items-baseline space-x-2 mb-6">
                        <span className="text-4xl font-bold gradient-text-primary">{vital.value}</span>
                        <span className="text-lg text-slate-500">{vital.unit}</span>
                      </div>

                      {/* Animated chart line */}
                      <div className="h-16 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        <svg className="w-full h-full" viewBox="0 0 200 60">
                          <path
                            d="M0,30 Q50,20 100,30 T200,30"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            fill="none"
                            className="animate-pulse"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="50%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Data Flow Animation */}
            <Card className="glass rounded-3xl border-0 glow-rainbow animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader className="pb-6">
                <CardTitle className="font-orbitron gradient-text-rainbow flex items-center text-2xl">
                  Data Processing Pipeline
                  <ArrowRight className="ml-3 w-6 h-6 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-6">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-soft">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-lg">Vitals Data</p>
                      <p className="text-slate-600">Real-time monitoring</p>
                    </div>
                  </div>

                  <div className="flex-1 mx-12">
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse-soft" style={{ animationDelay: "0.5s" }}>
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-lg">AI Analysis</p>
                      <p className="text-slate-600">ML Models + LLM Engine</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
