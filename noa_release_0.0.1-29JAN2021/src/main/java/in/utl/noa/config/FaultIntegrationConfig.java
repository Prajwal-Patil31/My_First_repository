package in.utl.noa.config;

import java.util.Arrays;
import java.util.Properties;
import java.util.concurrent.Executors;

import javax.persistence.EntityManagerFactory;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.StaticApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.integration.aggregator.AggregatingMessageHandler;
import org.springframework.integration.aggregator.MethodInvokingCorrelationStrategy;
import org.springframework.integration.aggregator.MethodInvokingMessageGroupProcessor;
import org.springframework.integration.aggregator.TimeoutCountSequenceSizeReleaseStrategy;
import org.springframework.integration.annotation.IntegrationComponentScan;
import org.springframework.integration.channel.ExecutorChannel;
import org.springframework.integration.channel.NullChannel;
import org.springframework.integration.channel.PriorityChannel;
import org.springframework.integration.channel.QueueChannel;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.IntegrationFlows;
import org.springframework.integration.dsl.MessageChannels;
import org.springframework.integration.dsl.Pollers;
import org.springframework.integration.handler.MessageHandlerChain;
import org.springframework.integration.handler.MethodInvokingMessageProcessor;
import org.springframework.integration.handler.ServiceActivatingHandler;
import org.springframework.integration.json.JsonToObjectTransformer;
import org.springframework.integration.mail.MailSendingMessageHandler;
import org.springframework.integration.router.HeaderValueRouter;
import org.springframework.integration.scheduling.PollerMetadata;
import org.springframework.integration.store.SimpleMessageGroupFactory;
import org.springframework.integration.store.SimpleMessageStore;
import org.springframework.integration.support.json.Jackson2JsonObjectMapper;
import org.springframework.integration.support.json.JsonObjectMapper;
import org.springframework.integration.transformer.MethodInvokingTransformer;
import org.springframework.integration.transformer.Transformer;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.messaging.MessageHandler;

import in.utl.noa.dto.FaultDTO;
import in.utl.noa.service.FaultService;
import in.utl.noa.util.FaultMessageCorrelator;
import in.utl.noa.util.FaultMessageGroupProcessor;

@Configuration
@EnableAutoConfiguration
@EnableIntegration
@IntegrationComponentScan
public class FaultIntegrationConfig {

    @Autowired
    Environment env;

    @Autowired
    FaultService faultService;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    private StaticApplicationContext context = new StaticApplicationContext();

    @Bean
    public PriorityChannel elementMessageQueueChannel() {
        return MessageChannels.priority("elementMessageQueueChannel").get();
    }

    @Bean
    public QueueChannel faultTrapQueueChannel() {
        return MessageChannels.queue("faultTrapQueueChannel").get();
    }

    @Bean
    public QueueChannel faultMailQueueChannel() {
        return MessageChannels.queue("faultMailQueueChannel").get();
    }

    @Bean
    public HeaderValueRouter elementMessageRouter() {
        HeaderValueRouter router = new HeaderValueRouter("messageRouter");
        router.setChannelMapping("elementHEALTH", "healthProcessorChannel");
        router.setChannelMapping("elementFAULT", "faultProcessorChannel");
        return router;
    }

    @Bean
    public QueueChannel healthProcessorChannel() {
        return MessageChannels.queue("healthProcessorChannel").get();
    }

    @Bean
    public ExecutorChannel faultProcessorChannel() {
        return new ExecutorChannel(Executors.newCachedThreadPool());
    }

    @Bean
    public MessageHandler FaultCorrelationHandler() {
        SimpleMessageStore simpleMessageStore = new SimpleMessageStore();
        SimpleMessageGroupFactory messageGroupFactory = new SimpleMessageGroupFactory(
                SimpleMessageGroupFactory.GroupType.LIST);
        simpleMessageStore.setMessageGroupFactory(messageGroupFactory);

        MethodInvokingMessageGroupProcessor processor = new MethodInvokingMessageGroupProcessor(
                new FaultMessageGroupProcessor());
        AggregatingMessageHandler handler = new AggregatingMessageHandler(processor, simpleMessageStore);

        handler.setReleaseStrategy(new TimeoutCountSequenceSizeReleaseStrategy(5, 3000));
        handler.setExpireGroupsUponCompletion(true);

        MethodInvokingCorrelationStrategy correlator = new MethodInvokingCorrelationStrategy(
                new FaultMessageCorrelator(), "getFaultId");
        handler.setCorrelationStrategy(correlator);

        return handler;
    }

    @Qualifier("processSeverity")
    private MessageHandler FaultSeverityHandler() {
        MethodInvokingMessageProcessor<FaultService> processor = new MethodInvokingMessageProcessor<>(
            this.faultService, "processSeverity");
        processor.setBeanFactory(context);
        MessageHandler handler = new ServiceActivatingHandler(processor);
        return handler;
    }

    @Qualifier("processClearance")
    private MessageHandler FaultClearanceHandler() {
        MethodInvokingMessageProcessor<FaultService> processor = new MethodInvokingMessageProcessor<>(
            this.faultService, "processClearance");
        processor.setBeanFactory(context);
        MessageHandler handler = new ServiceActivatingHandler(processor);
        return handler;
    }

    @Qualifier("processReporting")
    private MessageHandler FaultReportingHandler() {
        MethodInvokingMessageProcessor<FaultService> processor = new MethodInvokingMessageProcessor<>(
            this.faultService, "processReporting");
        processor.setBeanFactory(context);
        MessageHandler handler = new ServiceActivatingHandler(processor);
        return handler;
    }

    @Bean
    public MessageHandlerChain FaultProcesChain() {
        MessageHandlerChain chain = new MessageHandlerChain();
        chain.setHandlers(Arrays.asList(
            FaultSeverityHandler(),
            FaultClearanceHandler(),
            FaultReportingHandler()
        ));
        return chain;
    }

    @Bean
    public JsonToObjectTransformer FaultDtoTransformer() {
        ObjectMapper mapper = new ObjectMapper();
        JsonObjectMapper<JsonNode, JsonParser> jm = new Jackson2JsonObjectMapper(mapper);
        JsonToObjectTransformer transformer = new JsonToObjectTransformer(FaultDTO.class, jm);
        transformer.setBeanFactory(context);
        return transformer;
    }

    @Qualifier("faultDao")
    private Transformer FaultDaoTransformer() {
        MethodInvokingTransformer transformer = new MethodInvokingTransformer(this.faultService, "faultDao");
        transformer.setBeanFactory(context);
        return transformer;
    }

    @Qualifier("faultMail")
    private Transformer FaultMailTransformer() {
        MethodInvokingTransformer transformer = new MethodInvokingTransformer(this.faultService, "faultMail");
        transformer.setBeanFactory(context);
        return transformer;
    }

    @Qualifier("faultTrap")
    private Transformer FaultTrapTransformer() {
        MethodInvokingTransformer transformer = new MethodInvokingTransformer(this.faultService, "faultTrap");
        transformer.setBeanFactory(context);
        return transformer;
    }

    @Bean(name = PollerMetadata.DEFAULT_POLLER)
    public PollerMetadata poller() {
        return Pollers.fixedRate(1000).maxMessagesPerPoll(1).get();
    }

    @Bean
    public IntegrationFlow elementMessageFlow() {
        return IntegrationFlows.from(elementMessageQueueChannel())
                .route(elementMessageRouter()).get();
    }

    @Bean
    public JavaMailSenderImpl mailSender() throws Exception {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        Properties properties = new Properties();

        if (env.containsProperty("mail.server.host")) {
            mailSender.setHost(env.getProperty("mail.server.host"));
        } else {
            throw new Exception("Missing mail.server.host property");
        }
        if (env.containsProperty("mail.server.port")) {
            mailSender.setPort(Integer.parseInt(env.getProperty("mail.server.port")));
        } else {
            throw new Exception("Missing mail.server.port property");
        }
        if (env.containsProperty("mail.server.username")) {
            mailSender.setUsername(env.getProperty("mail.server.username"));
        } else {
            throw new Exception("Missing mail.server.username property");
        }
        if (env.containsProperty("mail.server.password")) {
            mailSender.setPassword(env.getProperty("mail.server.password"));
        } else {
            throw new Exception("Missing mail.server.password property");
        }
        if (env.containsProperty("mail.smtp.auth")) {
            properties.setProperty("mail.smtp.auth", env.getProperty("mail.smtp.auth"));
        }
        if (env.containsProperty("mail.smtp.starttls.enable")) {
            properties.setProperty("mail.smtp.starttls.enable", env.getProperty("mail.smtp.starttls.enable"));
        }

        mailSender.setJavaMailProperties(properties);
        return mailSender;
    }

    @Bean
    public MailSendingMessageHandler FaultMailSendingHandler() throws Exception {
        MailSendingMessageHandler mailHandler = new MailSendingMessageHandler(mailSender());
        return mailHandler;
    }

    @Bean
    public IntegrationFlow FaultMailFlow() {
        IntegrationFlow mailFlow = null;

        try {
            mailFlow = IntegrationFlows.from(faultMailQueueChannel())
                .handle(FaultMailSendingHandler())
                .get();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mailFlow;
    }

    @Bean
    public IntegrationFlow faultIntegrationFlow() {
        return IntegrationFlows.from(faultProcessorChannel())
            .transform(FaultDtoTransformer())
            .handle(FaultCorrelationHandler())
            .transform(FaultDaoTransformer())
            .handle(FaultProcesChain())
            .routeToRecipients(r -> r
                //TODO:: Use JPA Outbound Adapter instead of Direct JPA
                /* .recipientFlow(
                    f -> f.handle(Jpa.outboundAdapter(this.entityManagerFactory)
                            .entityClass(Fault.class)
                            .persistMode(PersistMode.MERGE), e -> e.transactional())) */
                /* .recipientFlow(new FunctionExpression<Message<?>>(m -> m.getHeaders().get("report-mail")),
                    f -> f.transform(FaultMailTransformer())
                            .channel(faultMailQueueChannel()))
                .recipientFlow(new FunctionExpression<Message<?>>(m -> m.getHeaders().get("report-trap")),
                    f -> f.transform(FaultTrapTransformer())
                            .channel(faultTrapQueueChannel())) */
                .defaultOutputToParentFlow())
            .channel(new NullChannel())
            .get();
    }
}