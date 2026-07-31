FROM alpine:latest

ARG PB_VERSION=0.22.0 # Asegúrate de usar una versión válida o actual

RUN apk add --no-cache unzip ca-certificates

# Descargar PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Exponer el puerto por defecto
EXPOSE 8080

# Iniciar PocketBase y asegurar que los datos persistan en /pb/pb_data
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]