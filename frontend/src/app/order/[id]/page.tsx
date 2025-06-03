"use client"
import { use } from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Car,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ImageIcon,
  Hash,
} from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  ticketNumber: string
  title: string
  vehicle: string
  description: string
  conclusionDate: string
  status: string
  mediaIds: string[]
  createdAt: string
}

interface Props {
  params: Promise<{ id: string }>
}

const getStatusConfig = (status: string) => {
  const configs = {
    'Pronto': {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      label: "Concluído",
    },
    'Em progresso': {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      label: "Em Andamento",
    },
    'Pendente': {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
      label: "Pendente",
    },
  }

  return configs[status as keyof typeof configs] || configs.Pendente
}

export default function ServiceDetails({ params: asyncParams }: Props) {
  const { id } = use(asyncParams)
  const [service, setService] = useState<Service | null>(null)
  const [error, setError] = useState("")
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    axios
      .get<Service>(`http://localhost:8080/services/public/${id}`)
      .then((res) => setService(res.data))
      .catch(() => setError("Erro ao buscar dados do serviço"))
  }, [id])

  const handleImageError = (mediaId: string) => {
    setImageErrors((prev) => new Set([...prev, mediaId]))
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert className="border-red-300 bg-red-50">
            <AlertCircle className="h-4 w-4 text-[#CF0F47]" />
            <AlertDescription className="text-[#CF0F47]">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" style={{ backgroundColor: "#EAEAEA" }} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-32 w-full" style={{ backgroundColor: "#EAEAEA" }} />
                <Skeleton className="h-24 w-full" style={{ backgroundColor: "#EAEAEA" }} />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" style={{ backgroundColor: "#EAEAEA" }} />
                <Skeleton className="h-16 w-full" style={{ backgroundColor: "#EAEAEA" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(service.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#CF0F47" }}>
              <Hash className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#4C4C4C]">{service.ticketNumber}</h1>
              <p className="text-lg text-[#ACACAC]">{service.title}</p>
            </div>
          </div>

          <Badge className="px-3 py-1 text-sm font-medium border" style={{ backgroundColor: "#CF0F47", color: "#fff", borderColor: "#CF0F47" }}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {statusConfig.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card className="border-0 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#4C4C4C]">
                  <FileText className="h-5 w-5" style={{ color: "#CF0F47" }} />
                  Descrição do Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#555555] leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>

            {/* Images Card */}
            {service.mediaIds.length > 0 && (
              <Card className="border-0 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-[#4C4C4C]">
                    <ImageIcon className="h-5 w-5" style={{ color: "#CF0F47" }} />
                    Imagens do Serviço ({service.mediaIds.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.mediaIds.map((mediaId) => (
                      <div key={mediaId} className="relative group">
                        {!imageErrors.has(mediaId) ? (
                          <Link href={`/order/${id}/media/${mediaId}`}>
                            <Image
                              src={`http://localhost:9000/images/${mediaId}`}
                              alt="Imagem do serviço"
                              width={400}
                              height={300}
                              className="rounded-lg shadow-md object-cover w-full h-48 transition-transform group-hover:scale-105 cursor-pointer"
                              onError={() => handleImageError(mediaId)}
                               unoptimized={true} 
                            />
                          </Link>
                        ) : (
                          <div
                            className="w-full h-48 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "#EAEAEA" }}
                          >
                            <div className="text-center text-[#bfbfbf]">
                              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">Imagem não disponível</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card className="border-0 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#4C4C4C]">
                  <Car className="h-5 w-5" style={{ color: "#CF0F47" }} />
                  Veículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-[#555555]">{service.vehicle}</p>
              </CardContent>
            </Card>

            {/* Dates Info */}
            <Card className="border-0 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#4C4C4C]">
                  <Calendar className="h-5 w-5" style={{ color: "#CF0F47" }} />
                  Datas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[#ACACAC]">Criado em</p>
                  <p className="text-[#4C4C4C]">
                    {new Date(service.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-[#ACACAC]">Data de Conclusão</p>
                  <p className="text-[#4C4C4C]">
                    {service.conclusionDate
                      ? new Date(service.conclusionDate).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Não definida"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
