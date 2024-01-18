# Stage 1: Build the application
FROM maven:3.6.3-openjdk-11 as builder

ARG VERSION=0.0.1-SNAPSHOT

WORKDIR /build/

COPY pom.xml /build/
COPY src /build/src/

RUN mvn clean package

# Stage 2: Create the final image
FROM openjdk:11-jre

WORKDIR /app/

# Copy the built JAR file from the builder stage
COPY --from=builder /build/target/ems-application-${VERSION}.jar /app/application.jar

CMD java -jar /app/application.jar
