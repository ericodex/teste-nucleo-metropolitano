FROM maven:3.8.5-openjdk-17 as build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean install -DskipTests
FROM openjdk:25-ea-17-slim-bullseye
WORKDIR /app
COPY --from=build /app/target/gestaoProdutosNucleMetropolitano-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 13434 
ENTRYPOINT ["java", "-jar", "app.jar"]