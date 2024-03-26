package in.utl.noa.service;

import static in.utl.noa.util.FaultConstants.CLEARING_FAULT;

import java.util.Date;

import javax.annotation.PostConstruct;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.integration.annotation.Transformer;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.utl.noa.dto.FaultDTO;
import in.utl.noa.model.Fault;
import in.utl.noa.model.FaultConfig;
import in.utl.noa.model.FaultConfigRepository;
import in.utl.noa.model.FaultRepository;

@Service("faultService")
@Transactional
public class FaultService {
    private static Logger logger = Logger.getLogger(FaultService.class);
    
    @Autowired
    Environment env;
    
    @Autowired
    JavaMailSenderImpl mailSender;

    @Autowired
    FaultConfigRepository faultConfigRepo;

    @Autowired
    FaultRepository faultRepo;

    @PostConstruct
	public void initialize() {
    }
    
    public Message<?> processSeverity(Message<?> msg) {
        Message<?> message;

        Fault payload = ((Fault) msg.getPayload());
        FaultConfig faultConfig = this.faultConfigRepo.isFaultConfigured(payload.getFaultErrorCode());

        if (faultConfig == null) {
            logger.info("Processing Fault Severity:: Fault is Not Configured...Discarding");
            return null;
        }

        payload.setSeverity(faultConfig.getSeverity());
        message = MessageBuilder.createMessage(payload, msg.getHeaders());

        logger.info("Processing Fault Severity:: Updated Fault Severity " + ((Fault)message.getPayload()).getSeverity());
        return message;
    }
    
    public Message<?> processClearance(Message<?> msg) {

        Fault payload = ((Fault) msg.getPayload());
        int errorCode = payload.getFaultErrorCode();
        String troubleSysId = payload.getFaultSysId();
        Date genDate = payload.getFaultDate();

        FaultConfig faultConfig = this.faultConfigRepo.isFaultConfigured(errorCode);

        if (faultConfig == null) {
            logger.info("Processing Fault Clearance:: Fault is Not Configured...Discarding");
            return null;
        }

        if (faultConfig.getSeverity() == CLEARING_FAULT) {
            boolean clr = this.faultRepo.clearFaults(faultConfig.getRelatedErrorCode(), 
                                                troubleSysId);
            logger.info("Processing Fault Clearance:: Faults Cleared: " + clr);
        }

        //TODO:: To Process in a Dedicated Fault Correlation Handler
        boolean dup = this.faultRepo.isDuplicateFault(errorCode, troubleSysId);

        //TODO:: To Mark Messages for Handling by JPA Outbound Adapter later in the Processing Chain
        if (!dup) {
            logger.info("Processing Fault Clearance:: No Duplicate Faults Found, Storing Received Fault");
            this.faultRepo.save(payload);
        } else {
            logger.info("Processing Fault Clearance:: Updating Count for Duplicate Fault");
            this.faultRepo.updateFaultCountAndDate(errorCode, troubleSysId, genDate);
        }

        return msg;
    }

    public Message<?> processReporting(Message<?> msg) {
        //TODO:: Add Business Logic for Sending Mail/Trap Based on Configuration
        Message<?> message = MessageBuilder.fromMessage(msg)
            .setHeader("report-mail", true)
            .setHeader("report-trap", true)
            .build();

        logger.info("Processing Fault Reporting:: " + message);
        return message;
    }

    @Transformer
    public Fault faultDao(FaultDTO dto) {
        Fault fault = new Fault();
        fault.setFaultErrorCode(Integer.parseInt(dto.getErrorCode()));
        fault.setFaultDate(new Date(dto.getTimeOfDay()));
        fault.setFaultSysId(dto.getSystemId());
        fault.setFaultContent(dto.getFaultContent());
        fault.setSeverity(0);
        fault.setSiteId(Integer.parseInt(dto.getSiteId()));
        return fault;
    }

    @Transformer
    public MimeMessage faultMail(Fault fault) {        
        MimeMessage mimeMessage = null;
        String mailBody = null;
    
        mailBody = fault.getHost() + fault.getFaultId() + fault.getFaultContent();

        try {
            mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
            message.setTo(env.getProperty("mail.message.to"));
            message.setFrom(env.getProperty("mail.message.from"));
            message.setSubject("NOA Fault : " + fault.getFaultId() + "On Host " + fault.getHost());
            message.setText(mailBody);
            message.setSentDate(new Date(System.currentTimeMillis()));
        }
        catch (MessagingException | MailException e) {
            logger.error("faultMail:: Error Creating Mail Message: ", e);
        }
        
        logger.info("faultMail:: Mail Message: " + mimeMessage);
        return mimeMessage;
    }

    @Transformer
    public Fault faultTrap(Fault fault) {
        logger.info("faultTrap:: " + fault);
        return fault;
    }
}