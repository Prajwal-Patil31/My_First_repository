package com.client.clientnetconf;

import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IoSession;

public class NetconfClientHandler extends IoHandlerAdapter 
{
 @Override
    public void sessionOpened(IoSession session) {

    }

    @Override
    public void messageReceived(IoSession session, Object message) {
        String receivedMessage = message.toString();
        System.out.println("Received message from server: " + receivedMessage);

        // Handle the received Netconf message here if required
        processNetconfResponse(receivedMessage);
    }

    private void processNetconfResponse(String netconfResponse) {
        // Log the received Netconf response
        System.out.println("Processing Netconf response: " + netconfResponse);
    }

    @Override
    public void exceptionCaught(IoSession session, Throwable cause) {
        System.err.println("Exception caught: " + cause.getMessage());
        cause.printStackTrace();
        session.closeNow();
    }    
}
