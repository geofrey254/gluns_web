'use client'

import { X, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  url: string
  title?: string
  onClose: () => void
}

export default function ViewPaperModal({ url, title, onClose }: Props) {
  const isPDF = url.toLowerCase().endsWith('.pdf')

  const viewerUrl = isPDF
    ? url
    : `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#85c226]" />
            <h3 className="font-bold text-[#104179] truncate">{title ?? 'Position Paper'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a href={url} download>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </a>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-[#104179]" />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 bg-[#104179]/5">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-none"
            title="Position Paper Viewer"
          />
        </div>
      </div>
    </div>
  )
}
