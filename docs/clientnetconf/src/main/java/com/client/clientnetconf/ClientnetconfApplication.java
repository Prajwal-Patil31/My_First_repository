package com.client.clientnetconf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.codec.textline.TextLineCodecFactory;
import org.apache.mina.core.future.ConnectFuture;
import org.apache.mina.core.service.IoConnector;
import org.apache.mina.transport.socket.nio.NioSocketConnector;

import java.net.InetSocketAddress;

@SpringBootApplication
public class ClientnetconfApplication {

	public static void main(String[] args) throws Exception 
	{
		SpringApplication.run(ClientnetconfApplication.class, args);
		System.out.println(">>>>>>>>>>"+" Netconf client application started "+"<<<<<<<<<<");

		String serverAddress = "127.0.0.1"; 
        int serverPort = 15830; 

        IoConnector connector = new NioSocketConnector();
        connector.getFilterChain().addLast("codec", new ProtocolCodecFilter(new TextLineCodecFactory()));
        connector.setHandler(new NetconfClientHandler());

        // Connect to the Netconf server
        ConnectFuture future = connector.connect(new InetSocketAddress(serverAddress, serverPort));
        future.awaitUninterruptibly();

        // Obtain a session
        IoSession session = future.getSession();

        // Handle authentication and errors
        handleAuthentication(session);

        // Perform Netconf <get> operation
        performNetconfGetConfigOperation(session);
        Thread.sleep(5000);
        // Close the session and connector when done
        session.closeNow().awaitUninterruptibly();
        connector.dispose();
    }

    private static void handleAuthentication(IoSession session) {
        try {
            // Authenticate using username and password
            String username = "admin";
            String password = "admin";

            String authenticationMessage = "<rpc message-id=\"2\" xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\">\n" +
                    "    <hello>\n" +
                    "        <capabilities>\n" +
                    "            <capability>urn:ietf:params:netconf:base:1.0</capability>\n" +
                    "        </capabilities>\n" +
                    "        <session-id>1</session-id>\n" +
                    "        <username>" + username + "</username>\n" +
                    "        <password>" + password + "</password>\n" +
                    "    </hello>\n" +
                    "</rpc>";

            session.write(authenticationMessage);
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            session.closeNow();
        }
    }

    private static void performNetconfGetConfigOperation(IoSession session) {
        try {
            // Create a Netconf <get-config> operation
            String getConfigOperation = "<rpc message-id=\"1\" xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\">\n" +
                    "    <get-config>\n" +
                    "        <source>\n" +
                    "            <running/>\n" +
                    "               </source>\n" +
                    "                <filter>\n" +
                    "                 <person-details xmlns=\"urn:example:person-details\">\n" +
                    "                <name>Prajwal</name>\n" +
                    "                <age>23</age>\n" +
                    "                <address>Bangalore</address>\n" +
                    "            </person-details>\n" +
                    "        </filter>\n" +
                    "    </get-config>\n" +
                    "</rpc>";
    
            // Log the Netconf operation before sending
            System.out.println("Sending Netconf <get-config> operation:\n" + getConfigOperation);
    
            // Send the Netconf <get-config> operation to the server
            session.write(getConfigOperation);
        } catch (Exception e) {
            System.err.println("Failed to perform Netconf <get-config> operation: " + e.getMessage());
            e.printStackTrace();
            session.closeNow();
        }
    }
}
    
    

    


