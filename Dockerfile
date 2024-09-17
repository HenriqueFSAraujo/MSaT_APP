#Baixando imagem maven
FROM maven:3.8.3-openjdk-17 AS builder

#Criando diretorio e copiando informações
WORKDIR /build
COPY . /build

# Generate build of the applicatin argument
RUN mvn clean package


#Baixar imagem java
FROM openjdk:17.0.1-jdk-slim

#Mover jar para diretorio criado
COPY --from=builder /build/target/*.jar /garantias-api.jar

#Executar comando para startar aplicação
ENTRYPOINT ["java","-jar","garantias-api.jar"]

#Expor porta de acesso
EXPOSE 8080 8082