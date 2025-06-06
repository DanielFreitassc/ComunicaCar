# Dockerfile para MinIO pronto para produção/render

FROM minio/minio:latest


# Porta que o MinIO usa
EXPOSE 9000

# Diretório para armazenar os dados persistentes
VOLUME ["/data"]

# Comando para iniciar o MinIO no modo servidor com diretório de dados /data
CMD ["server", "/data"]
