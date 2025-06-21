const minioBaseUrl = process.env.NEXT_PUBLIC_MINIO_BASE_URL || "http://localhost:9000/images";

export function getImageUrl(imageId: string) {
  return `${minioBaseUrl}/${imageId}`;
}
