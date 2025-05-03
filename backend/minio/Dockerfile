FROM quay.io/minio/minio

# Define o diretório de trabalho
WORKDIR /data

# Exponha as portas necessárias
EXPOSE 9000 9001

# Comando de inicialização do MinIO
CMD ["server", "/data", "--console-address", ":9001"]