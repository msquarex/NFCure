import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0D1117] border-t border-[#00F5D4]/20 mt-20">
      {/* Neon accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="font-orbitron text-2xl font-bold bg-gradient-to-r from-[#00F5D4] to-[#00C2FF] bg-clip-text text-transparent mb-4">
              NFCCure
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Revolutionary healthcare technology powered by NFC, AI, and advanced vision scanning. Transforming the
              future of medical diagnostics and patient care.
            </p>
            <div className="flex space-x-4 mt-6">
              <div className="w-2 h-2 bg-[#00F5D4] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#00C2FF] rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              <div className="w-2 h-2 bg-[#9A00FF] rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron text-lg font-semibold text-[#00F5D4] mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#00F5D4] transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/nfc-tap" className="text-gray-400 hover:text-[#00F5D4] transition-colors duration-300">
                  NFC Tap
                </Link>
              </li>
              <li>
                <Link href="/ai-insights" className="text-gray-400 hover:text-[#00F5D4] transition-colors duration-300">
                  AI Insights
                </Link>
              </li>
              <li>
                <Link href="/vision-scan" className="text-gray-400 hover:text-[#00F5D4] transition-colors duration-300">
                  Vision Scan
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-orbitron text-lg font-semibold text-[#00C2FF] mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#00C2FF] transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#00C2FF] transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#00C2FF] transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#00C2FF] transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 NFCCure. All rights reserved. Built with cutting-edge AI technology.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="text-xs text-gray-500">Powered by</div>
              <div className="flex space-x-2">
                <span className="text-xs px-2 py-1 bg-[#00F5D4]/10 text-[#00F5D4] rounded border border-[#00F5D4]/20">
                  NFC
                </span>
                <span className="text-xs px-2 py-1 bg-[#00C2FF]/10 text-[#00C2FF] rounded border border-[#00C2FF]/20">
                  AI/ML
                </span>
                <span className="text-xs px-2 py-1 bg-[#9A00FF]/10 text-[#9A00FF] rounded border border-[#9A00FF]/20">
                  Vision
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
