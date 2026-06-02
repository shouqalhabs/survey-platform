"use client"

import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Copy, Check, ExternalLink } from "lucide-react"
import { useState, useRef } from "react"
import type { MSForm } from "@/lib/types"

interface QRCodeModalProps {
  open: boolean
  onClose: () => void
  form: MSForm | null
}

export function QRCodeModal({ open, onClose, form }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  
  if (!form) return null

  const copyLink = async () => {
    await navigator.clipboard.writeText(form.formUrl)
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
      ctx!.fillStyle = "#ffffff"
      ctx?.fillRect(0, 0, canvas.width, canvas.height)
      ctx?.drawImage(img, 0, 0, 400, 400)
      
      const link = document.createElement("a")
      link.download = `qr-${form.title}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">{form.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div 
            ref={qrRef}
            className="bg-white p-6 rounded-2xl shadow-xl border-4 border-primary/20"
          >
            <QRCodeSVG
              value={form.formUrl}
              size={220}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#4361ee"
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Scan the QR code to access the Microsoft Form directly
          </p>

          <div className="flex items-center gap-2 w-full p-3 bg-secondary rounded-xl text-sm border">
            <span className="truncate flex-1 text-muted-foreground">
              {form.formUrl}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-accent" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-3">
              <Button onClick={downloadQR} className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download QR
              </Button>
              <Button onClick={copyLink} variant="outline" className="flex-1 gap-2">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-accent" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            <Button 
              variant="secondary" 
              className="w-full gap-2"
              onClick={() => window.open(form.formUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Open in Microsoft Forms
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
