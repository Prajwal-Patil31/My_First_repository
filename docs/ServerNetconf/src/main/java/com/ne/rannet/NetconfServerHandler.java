package com.ne.rannet;

import java.util.regex.Pattern;

import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IoSession;
import java.util.regex.Matcher;


public class NetconfServerHandler extends IoHandlerAdapter 
{
   
    @Override
    public void sessionOpened(IoSession session) {
        System.out.println("New session created: " + session.getRemoteAddress());
        sendWelcomeMessage(session);
    }

    @Override
    public void messageReceived(IoSession session, Object message) {
       
        String receivedMessage = message.toString();
        System.out.println("Received message from client: " + receivedMessage);

        // Check if the received message is a <hello> or <get-config> message
        if (receivedMessage.contains("<hello>"))
         {
            handleHelloMessage(session, receivedMessage);
        } else if (receivedMessage.contains("<get-config>")) {
            handleGetConfigMessage(session, receivedMessage);
        } else {
            // Handle other Netconf messages if needed
            handleUnknownMessage(session, receivedMessage);
        }
        
    }

    private void sendWelcomeMessage(IoSession session) {
        String welcomeMessage = "Welcome to the Netconf Server!";
        System.out.println("Sending welcome message to client: " + welcomeMessage);
        session.write(welcomeMessage);
    }

   
    private void handleHelloMessage(IoSession session, String helloMessage)
    {
        try{
        String username = extractUsername(helloMessage);
        String password = extractPassword(helloMessage);

        if (authenticate(username, password)) {
            String response = "<rpc-reply>Authentication successful</rpc-reply>";
            System.out.println("Authentication successful for user: " + username);
            session.write(response);
        } else {
            String response = "<rpc-error>Authentication failed</rpc-error>";
            System.out.println("Authentication failed for user: " + username);
            session.write(response);
            session.closeNow();
        }
    }
    catch(Exception e)
    {
        e.printStackTrace();
    }
    }

    private String extractUsername(String helloMessage) 
    {
        Pattern pattern = Pattern.compile("<username>(.*?)</username>");
        Matcher matcher = pattern.matcher(helloMessage);
        return matcher.find() ? matcher.group(1) : null;
    }
    

    private String extractPassword(String helloMessage)  {
        Pattern pattern = Pattern.compile("<password>(.*?)</password>");
        Matcher matcher = pattern.matcher(helloMessage);
        return matcher.find() ? matcher.group(1) : null;
    }

    private boolean authenticate(String username, String password) {
        return "admin".equals(username) && "admin".equals(password);
    }


    private void handleGetConfigMessage(IoSession session, String getConfigOperation) {
        String response = "<rpc-reply>Netconf response to <get-config> message</rpc-reply>";
        System.out.println("Received <get-config> message from client:\n" + getConfigOperation);
        System.out.println("Sending response to client: " + response);
        session.write(response);
        
    }

    private void handleUnknownMessage(IoSession session, String unknownMessage)
    {
        
        String response = "<rpc-error>Unknown Netconf message</rpc-error>";
        System.out.println("Received unknown Netconf message from client:\n" + unknownMessage);
        System.out.println("Sending error response to client: " + response);


    }

    @Override
    public void exceptionCaught(IoSession session, Throwable cause) {
        cause.printStackTrace();
        session.closeNow();
    }
}
