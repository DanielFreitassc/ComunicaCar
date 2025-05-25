FROM minio/minio:RELEASE.2025-01-20T14-49-07Z

# Define o diretório de trabalho
WORKDIR /data

# Exponha as portas necessárias
EXPOSE 9000 9001

# Comando de inicialização do MinIO
CMD ["server", "/data", "--console-address", ":9001"]