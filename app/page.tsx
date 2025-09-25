import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Zap, Brain, Eye } from "lucide-react"
import HyperspeedBackground from '@/components/HyperspeedBackground';
import TrueFocusHero from '@/components/TrueFocusHero';
import CircularGalleryDemo from '@/components/CircularGalleryDemo';
import ThreadsDemo from '@/components/ThreadsDemo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Stunning Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-50/30 to-cyan-100/50 animate-aurora"></div>
      
      

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
      <HyperspeedBackground />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Main Title with Stunning Effects */}
          <div className="mb-6 mt-4 animate-slide-in-up">
            <TrueFocusHero />
          </div>

          {/* Subtitle with Gradient */}
          <h2 className="heading-lg mb-4 text-slate-800 font-light tracking-wide animate-slide-in-up gradient-text-primary" style={{ animationDelay: '0.2s' }}>
            Smart NFC-Powered Healthcare
          </h2>

          {/* Tagline with Holographic Effect */}
          <p className="heading-md font-orbitron font-bold mb-8 gradient-text-holographic animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          Connect. Analyze. Transform.
          </p>

          {/* Stunning CTA Button */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <Link href="/nfc-tap">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-6 px-12 text-xl rounded-full transition-all duration-700 transform hover:scale-110 glow-rainbow animate-float-gentle shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Tap Your NFC Card</span>
              </Button>
            </Link>
          </div>

          {/* Floating Action Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Brain, label: "AI Analysis", color: "from-blue-500 to-purple-500" },
              { icon: Eye, label: "Vision Scan", color: "from-purple-500 to-cyan-500" },
              { icon: Zap, label: "Instant Access", color: "from-cyan-500 to-blue-500" }
            ].map((item, index) => (
              <div
                key={index}
                className="group glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 animate-slide-in-up animate-magnetic"
                style={{ animationDelay: `${0.8 + index * 0.2}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                  {item.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Gallery Section with Threads Background */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        {/* Threads Background */}
        <div className="absolute inset-x-0 bottom-0 h-[1000px]">
          <ThreadsDemo />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="heading-lg font-orbitron gradient-text-rainbow mb-6 animate-slide-in-up">
              Revolutionary Health Features
            </h2>
            <p className="text-xl text-slate-700 max-w-4xl mx-auto animate-slide-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Explore our revolutionary health features with interactive threads
            </p>        
          </div>

          {/* Circular Gallery Demo */}
          <CircularGalleryDemo />
        </div>
      </section>
    </div>
  )
}
