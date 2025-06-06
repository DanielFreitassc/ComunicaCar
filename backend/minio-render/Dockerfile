FROM minio/minio:RELEASE.2025-01-20T14-49-07Z

WORKDIR /data

EXPOSE 9000 9001

CMD ["sh", "-c", "minio server /data --console-address \":$PORT\" --address \":$PORT\""]


