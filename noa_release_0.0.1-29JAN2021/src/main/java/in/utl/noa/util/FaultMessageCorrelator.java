package in.utl.noa.util;

import in.utl.noa.dto.FaultDTO;
import org.springframework.messaging.Message;

import org.apache.log4j.Logger;

public class FaultMessageCorrelator {
    private static Logger logger = Logger.getLogger(FaultMessageCorrelator.class);

    public FaultMessageCorrelator() {
        super();
    }

    @SuppressWarnings("unused")
    public int getFaultId(Message<?> message) {
        logger.info("getFaultId:: " + ((FaultDTO) message.getPayload()).getFaultId());
        return (int) ((FaultDTO) message.getPayload()).getFaultId();
    }  
}