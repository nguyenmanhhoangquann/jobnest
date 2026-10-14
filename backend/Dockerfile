FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/jobnest-backend-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir -p /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
