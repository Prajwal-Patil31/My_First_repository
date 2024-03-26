FROM openjdk:8

ADD target/netconf-server-application.jar netconf-server-application.jar

EXPOSE 7777

ENTRYPOINT [ "java","-jar","netconf-server-application.jar"]

