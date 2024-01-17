FROM openjdk:8
ADD target/spring-netconf-client.jar spring-netconf-client.jar

EXPOSE 80

ENTRYPOINT [ "java","-jar","spring-netconf-client.jar"]

