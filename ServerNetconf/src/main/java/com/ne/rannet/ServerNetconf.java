package com.ne.rannet;

import org.apache.mina.core.service.IoAcceptor;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.codec.textline.TextLineCodecFactory;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.InetSocketAddress;

@SpringBootApplication
public class ServerNetconf implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(ServerNetconf.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        startNetconfServer();
    }

    private void startNetconfServer() throws Exception
    {

        int port = 15830; // Port for Netconf server

        IoAcceptor acceptor = new NioSocketAcceptor();
        acceptor.getFilterChain().addLast("codec", new ProtocolCodecFilter(new TextLineCodecFactory()));
        acceptor.setHandler(new NetconfServerHandler());

        acceptor.bind(new InetSocketAddress(port));

        System.out.println(">>>>>>>>>> "+"Netconf server started on port " + port+" <<<<<<<<<<");
    }
}
