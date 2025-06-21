"use client"
import { use } from "react"
import { useEffect, useState } from "react"
import { getServiceById } from "@/services/backend";
import { getImageUrl } from "@/services/minio"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"

interface Step {
  id: string
  title: string
  description: string
  createdAt: string
  imageIds: string[]
}

interface Service {
  id: string
  ticketNumber: string
  title: string
  vehicle: string
  description: string
  conclusionDate: string
  status: string
  steps: Step[]
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
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})

  useEffect(() => {
  async function fetchService() {
    try {
      const data = await getServiceById(id)
      setService(data)

      const expanded: Record<string, boolean> = {}
      data.steps.forEach((step: Step) => {
        expanded[step.id] = true
      })
      setExpandedSteps(expanded)
    } catch {
      setError("Erro ao buscar dados do serviço")
    }
  }

  if (id) {
    fetchService()
  }
}, [id])


  const handleImageError = (mediaId: string) => {
    setImageErrors((prev) => new Set([...prev, mediaId]))
  }

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }))
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

  // Calcula o total de imagens em todos os steps
  const totalImages = service.steps.reduce((acc, step) => acc + step.imageIds.length, 0)

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

            {/* Steps */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#4C4C4C] flex items-center gap-2">
                <Wrench className="h-5 w-5" style={{ color: "#CF0F47" }} />
                Passos do Serviço ({service.steps.length})
              </h2>

              {service.steps.map((step) => (
                <Card key={step.id} className="border-0 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
                  <CardHeader 
                    className="pb-3 cursor-pointer hover:bg-gray-50 rounded-t-lg" 
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-[#4C4C4C]">
                        <span className="text-[#CF0F47] font-bold">#{service.steps.indexOf(step) + 1}</span>
                        {step.title}
                      </CardTitle>
                      {expandedSteps[step.id] ? (
                        <ChevronUp className="h-5 w-5 text-[#ACACAC]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#ACACAC]" />
                      )}
                    </div>
                  </CardHeader>
                  
                  {expandedSteps[step.id] && (
                    <>
                      <CardContent>
                        <p className="text-[#555555] mb-4">{step.description}</p>
                        
                        {step.imageIds && step.imageIds.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-[#ACACAC] mb-2 flex items-center gap-1">
                              <ImageIcon className="h-4 w-4" />
                              Imagens deste passo ({step.imageIds.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {step.imageIds.map((imageId) => (
                                <div key={imageId} className="relative group">
                                  {!imageErrors.has(imageId) ? (
                                    <Link href={`/order/${id}/media/${imageId}`}>
                                      <Image
                                        src={getImageUrl(imageId)}
                                        alt={`Imagem do passo ${step.title}`}
                                        width={400}
                                        height={300}
                                        className="rounded-lg shadow-md object-cover w-full h-48 transition-transform group-hover:scale-105 cursor-pointer"
                                        onError={() => handleImageError(imageId)}
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
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="text-xs text-[#ACACAC]">
                        Criado em: {new Date(step.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </div>

            {/* All Images Card - Apenas se houver imagens */}
            {totalImages > 0 && (
              <Card className="border-0 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-[#4C4C4C]">
                    <ImageIcon className="h-5 w-5" style={{ color: "#CF0F47" }} />
                    Todas as Imagens do Serviço ({totalImages})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.steps.flatMap(step => 
                      step.imageIds?.map(imageId => (
                        <div key={imageId} className="relative group">
                          {!imageErrors.has(imageId) ? (
                            <Link href={`/order/${id}/media/${imageId}`}>
                              <Image
                                        src={getImageUrl(imageId)}
                                        alt={`Imagem do passo ${step.title}`}
                                        width={400}
                                        height={300}
                                        className="rounded-lg shadow-md object-cover w-full h-48 transition-transform group-hover:scale-105 cursor-pointer"
                                        onError={() => handleImageError(imageId)}
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
                      ))
                    )}
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
                    ? (() => {
                        const [day, month, year] = service.conclusionDate.split("/")
                        const date = new Date(`${year}-${month}-${day}`)
                        return date.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      })()
                    : "Não definida"}
                </p>

                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="border-0 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#4C4C4C]">
                  <FileText className="h-5 w-5" style={{ color: "#CF0F47" }} />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#ACACAC]">Passos:</span>
                  <span className="font-medium text-[#4C4C4C]">{service.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ACACAC]">Imagens:</span>
                  <span className="font-medium text-[#4C4C4C]">{totalImages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ACACAC]">Status:</span>
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}