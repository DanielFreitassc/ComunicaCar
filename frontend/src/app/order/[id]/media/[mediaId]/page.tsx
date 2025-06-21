"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, Share2, ImageIcon, AlertCircle } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/services/minio"

export default function MediaDetailPage() {
  const params = useParams()
  const { mediaId } = params as { mediaId: string }
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const imageUrl = getImageUrl(mediaId)

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error("Erro ao baixar imagem")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `image-${mediaId}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erro ao baixar imagem:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Imagem do Serviço",
          text: `Confira esta imagem do serviço - ID: ${mediaId}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [mediaId])

  if (imageError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 text-gray-dark hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-red-800">
              Não foi possível carregar a imagem. Verifique se o ID está correto.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => window.history.back()} className="text-gray-dark hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownload}
              className="
                bg-primary
                text-white
                hover:bg-primary/90
                hover:scale-105
                transform
                transition-all
                duration-200
              "
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>

            <Button
              onClick={handleShare}
              className="
                bg-slate-900
                text-white
                border-slate-700
                hover:bg-slate-800
                hover:scale-105
                transform
                transition-all
                duration-200
              "
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold text-gray-dark">Imagem do Serviço</h1>
              </div>
              <p className="text-sm text-gray-light font-mono bg-gray-100 px-3 py-1 rounded inline-block mb-4">
                ID: {mediaId}
              </p>

              <p className="text-gray-700 max-w-xl mx-auto text-center">
                Esta é a peça que foi trocada no carro do cliente. A imagem mostra o estado atual da peça substituída, garantindo transparência e documentação do serviço realizado.
              </p>
            </div>

            <div className="flex justify-center">
              {!imageLoaded && (
                <div className="w-full max-w-3xl aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-light">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                    <p>Carregando imagem...</p>
                  </div>
                </div>
              )}

              <Image
                src={imageUrl}
                alt="Imagem do serviço"
                width={800}
                height={600}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className="rounded-lg shadow-md object-contain max-w-full max-h-[70vh]"
                style={{ display: imageLoaded ? "block" : "none" }}
                unoptimized={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
