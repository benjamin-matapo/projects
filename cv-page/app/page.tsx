'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useEffect, useState } from "react"

export default function CVPage() {
  const [pdfSupported, setPdfSupported] = useState<boolean | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    // Check if browser supports PDF display
    const checkPdfSupport = () => {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      
      try {
        iframe.src = '/cv.pdf'
        const supported = iframe.contentWindow !== null
        document.body.removeChild(iframe)
        setPdfSupported(supported)
      } catch (error) {
        document.body.removeChild(iframe)
        setPdfSupported(false)
      }
    }

    // Get last modified date of CV file
    const getLastUpdated = async () => {
      try {
        const response = await fetch('/cv.pdf', { method: 'HEAD' })
        const lastModified = response.headers.get('last-modified')
        if (lastModified) {
          const date = new Date(lastModified)
          const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }
          setLastUpdated(date.toLocaleDateString('en-US', options))
        }
      } catch (error) {
        console.log('Could not fetch last modified date')
      }
    }

    checkPdfSupport()
    getLastUpdated()
  }, [])

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header Section */}
      <header className="text-center py-8 px-4 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
          Benjamin Matapo
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Computer Science Student
        </p>
        
        {/* Intro Paragraph */}
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto px-4 md:px-0">
          Here you can view and download my most recent CV, updated regularly.
        </p>
        
        {/* Last Updated Date */}
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {lastUpdated}
          </p>
        )}
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* PDF Preview Container */}
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
            <div className="relative w-full" style={{ height: "70vh" }}>
              {pdfSupported !== false ? (
                // Try iframe first (most compatible)
                <iframe
                  src="/cv.pdf#toolbar=1&navpanes=1&scrollbar=1"
                  width="100%"
                  height="100%"
                  className="border-0"
                  title="CV Preview"
                  style={{ display: 'block' }}
                  onError={() => setPdfSupported(false)}
                />
              ) : (
                // Fallback for browsers that don't support PDF preview
                <div className="flex items-center justify-center h-full bg-gray-50 text-center p-8">
                  <div className="max-w-md">
                    <div className="mb-6">
                      <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">PDF Preview Not Available</h3>
                      <p className="text-gray-600 mb-4">
                        Your browser doesn't support PDF preview. Please download the file to view it.
                      </p>
                    </div>
                    <Button asChild className="bg-[#0088F0] hover:bg-[#006BBE] text-white">
                      <a href="/cv.pdf" download="CV.pdf" className="inline-flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download CV
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p className="mb-2">
              {pdfSupported === null 
                ? "Loading PDF preview..." 
                : pdfSupported 
                  ? "Scroll to navigate the document" 
                  : "Download the PDF to view it in your preferred PDF reader"
              }
            </p>
            {pdfSupported && (
              <p className="text-xs">
                If the PDF doesn't load, try refreshing the page or use the download button below.
              </p>
            )}
          </div>

          {/* Desktop Download Button */}
          <div className="hidden md:block text-center mt-6">
            <Button
              asChild
              className="bg-[#0088F0] hover:bg-[#006BBE] text-white px-8 py-3 rounded-md transition-colors duration-200 shadow-md"
              aria-label="Download my CV as PDF"
            >
              <a href="/cv.pdf" download="CV.pdf" className="inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Download Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <Button
          asChild
          className="w-full bg-[#0088F0] hover:bg-[#006BBE] text-white py-3 rounded-md transition-colors duration-200"
          aria-label="Download my CV as PDF"
        >
          <a href="/cv.pdf" download="CV.pdf" className="inline-flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download CV
          </a>
        </Button>
      </div>
    </div>
  )
}
