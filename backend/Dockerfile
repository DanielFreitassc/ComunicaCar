# Etapa 1: Build com Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Execução com OpenJDK 21
FROM azul/zulu-openjdk-alpine:21
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar  
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 