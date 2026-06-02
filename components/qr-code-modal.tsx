"use client"

import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Copy, Check } from "lucide-react"
import { useState, useRef } from "react"

interface QRCodeModalProps {
  open: boolean
  onClose: () => void
  formId: string
  formTitle: string
}

export function QRCodeModal({ open, onClose, formId, formTitle }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  
  const formUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/form/${formId}`
    : `/form/${formId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(formUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      ctx?.fillRect(0, 0, canvas.width, canvas.height)
      ctx!.fillStyle = "#ffffff"
      ctx?.fillRect(0, 0, canvas.width, canvas.height)
      ctx?.drawImage(img, 0, 0, 400, 400)
      
      const link = document.createElement("a")
      link.download = `qr-${formTitle}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">رمز QR للاستبيان</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div 
            ref={qrRef}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <QRCodeSVG
              value={formUrl}
              size={200}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#1a1625"
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            امسح رمز QR هذا للوصول مباشرة إلى الاستبيان
          </p>

          <div className="flex items-center gap-2 w-full p-3 bg-muted rounded-lg text-sm">
            <span className="truncate flex-1 text-muted-foreground" dir="ltr">
              {formUrl}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex gap-3 w-full">
            <Button onClick={downloadQR} className="flex-1">
              <Download className="w-4 h-4 ml-2" />
              تحميل QR
            </Button>
            <Button onClick={copyLink} variant="outline" className="flex-1">
              {copied ? (
                <>
                  <Check className="w-4 h-4 ml-2" />
                  تم النسخ!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 ml-2" />
                  نسخ الرابط
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
