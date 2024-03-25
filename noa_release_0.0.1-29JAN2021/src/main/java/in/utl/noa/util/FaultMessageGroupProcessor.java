package in.utl.noa.util;

import in.utl.noa.dto.FaultDTO;

import org.springframework.messaging.Message;
import org.springframework.integration.support.MessageBuilder;

import org.apache.log4j.Logger;

import java.util.Collection;

public class FaultMessageGroupProcessor {
    private static Logger logger = Logger.getLogger(FaultMessageGroupProcessor.class);

    public Message<FaultDTO> process(Collection<Message> msgs) {
        logger.info("process:: " + msgs.size() + " Messages in Group");
        return msgs.iterator().next();
    }
}