FROM openjdk:11-jre
ADD target/ app.jar
EXPOSE 5555
ENTRYPOINT ["java","-Djava.security.edg=file:/dev/./urandom","-jar","app.jar"]