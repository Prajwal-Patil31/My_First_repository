package in.utl.noa.service;

import io.lighty.core.common.models.YangModuleUtils;
import io.lighty.core.controller.api.LightyController;
import io.lighty.core.controller.api.LightyModule;
import io.lighty.core.controller.impl.LightyControllerBuilder;
import io.lighty.core.controller.impl.config.ConfigurationException;
import io.lighty.core.controller.impl.config.ControllerConfiguration;
import io.lighty.core.controller.impl.util.ControllerConfigUtils;
import in.utl.noa.restconf.CommunityRestConf;
import in.utl.noa.restconf.CommunityRestConfBuilder;
import in.utl.noa.restconf.config.RestConfConfiguration;
import in.utl.noa.restconf.util.RestConfConfigUtils;
import io.lighty.modules.southbound.netconf.impl.NetconfTopologyPluginBuilder;
import io.lighty.modules.southbound.netconf.impl.config.NetconfConfiguration;
import io.lighty.modules.southbound.netconf.impl.util.NetconfConfigUtils;
import io.lighty.modules.southbound.openflow.impl.OpenflowSouthboundPlugin;
import io.lighty.modules.southbound.openflow.impl.OpenflowSouthboundPluginBuilder;
import io.lighty.modules.southbound.openflow.impl.config.OpenflowpluginConfiguration;
import io.lighty.modules.southbound.openflow.impl.util.OpenflowConfigUtils;
import io.lighty.server.LightyServerBuilder;
import in.utl.noa.restconf.swagger.SwaggerNOA;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;
import org.springframework.core.annotation.Order;
import org.springframework.context.ApplicationListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;

import org.opendaylight.yangtools.yang.binding.YangModuleInfo;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.common.base.Stopwatch;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.ListenableFuture;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.ServletContext;

/**
 * Service Component that encapsulates invocation of Controller and 
 * NB/SB Plugins with the provided Configuration input or default otherwise.
 * 
 * @see ApplicationListener
 * @see ServletContextAware
 */
@Component
@Order(0)
public class MDSALService implements ApplicationListener<ApplicationReadyEvent>, ServletContextAware {

    private static Logger logger = Logger.getLogger(MDSALService.class);
    static String FILE_MDSAL_PROPERTIES = "./mdsal.properties";

    private ShutdownHook shutdownHook;
    private ServletContext servletContext;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        startController(new String[] {}, true);
    }

    /**
     * Configuration wrapper for startMDSAL() Parses Configuration provided as input or the default.
     * 
     * @param args Path to the JSON configuraiton for Controller and NB/SB Plugins
     * @param registerShutdownHook Enable/Disable shutdown hook registration for the Service.
     */
    public void startController(String[] args, boolean registerShutdownHook) {
        final Stopwatch stopwatch = Stopwatch.createStarted();

        logger.info("_/\\\\\\\\\\_____/\\\\\\_______/\\\\\\\\\\__________/\\\\\\\\\\\\\\\\\\____        ");
        logger.info("_\\/\\\\\\\\\\\\___\\/\\\\\\_____/\\\\\\///\\\\\\______/\\\\\\\\\\\\\\\\\\\\\\\\\\__       ");
        logger.info(" _\\/\\\\\\/\\\\\\__\\/\\\\\\___/\\\\\\/__\\///\\\\\\___/\\\\\\/////////\\\\\\_      ");
        logger.info("  _\\/\\\\\\//\\\\\\_\\/\\\\\\__/\\\\\\______\\//\\\\\\_\\/\\\\\\_______\\/\\\\\\_     ");
        logger.info("   _\\/\\\\\\\\//\\\\\\\\/\\\\\\_\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_    ");
        logger.info("    _\\/\\\\\\_\\//\\\\\\/\\\\\\_\\//\\\\\\______/\\\\\\__\\/\\\\\\/////////\\\\\\_   ");
        logger.info("     _\\/\\\\\\__\\//\\\\\\\\\\\\__\\///\\\\\\__/\\\\\\____\\/\\\\\\_______\\/\\\\\\_  ");
        logger.info("      _\\/\\\\\\___\\//\\\\\\\\\\____\\///\\\\\\\\\\/_____\\/\\\\\\_______\\/\\\\\\_ ");
        logger.info("       _\\///_____\\/////_______\\/////_______\\///________\\///__");

        logger.info("Starting NOA MDSAL Service Service ...");

        ControllerConfiguration singleNodeConfiguration;
        RestConfConfiguration restConfConfiguration;
        NetconfConfiguration netconfSBPConfiguration;
        OpenflowpluginConfiguration openflowSBPConfiguration;

        Resource configFile = new ClassPathResource("MDSConfigSingleNode.json");
        Path configPath = null;

        try {
			configPath = args.length > 0 ? Paths.get(args[0]) : configFile.getFile().toPath();
		} catch (IOException cause) {
			logger.error("MD-SAL RESTCONF-NETCONF Service - Error Reading Configuraiton: ", cause);
		}

        try {
            if ((configPath != null) && (Files.exists(configPath))) {
                logger.info("Using Configuration From File {} ..." + configPath.getFileName());

                // Controller Configuration
                singleNodeConfiguration = ControllerConfigUtils
                        .getConfiguration(Files.newInputStream(configPath));

                // RESTCONF NBP Configuration
                restConfConfiguration = RestConfConfigUtils
                        .getRestConfConfiguration(Files.newInputStream(configPath));

                // NETCONF SBP Configuration
                netconfSBPConfiguration = NetconfConfigUtils
                        .createNetconfConfiguration(Files.newInputStream(configPath));

                // OpenFlow SBP Configuration
                openflowSBPConfiguration = OpenflowConfigUtils
                        .getOfpConfiguration(Files.newInputStream(configPath));
            } else {
                logger.info("Using Default Configuration ...");
                Set<YangModuleInfo> modelPaths = Stream.concat(RestConfConfigUtils.YANG_MODELS.stream(),
                        NetconfConfigUtils.NETCONF_TOPOLOGY_MODELS.stream()).collect(Collectors.toSet());

                ArrayNode arrayNode = YangModuleUtils.generateJSONModelSetConfiguration(
                        Stream.concat(ControllerConfigUtils.YANG_MODELS.stream(), modelPaths.stream())
                                .collect(Collectors.toSet()));
                // List of Schema Context Models
                logger.info("JSON model config snippet: {}" + arrayNode.toString());

                // Controller Default Configuration
                singleNodeConfiguration = ControllerConfigUtils
                        .getDefaultSingleNodeConfiguration(modelPaths);

                // RESTCONF NBP Default Configuration
                restConfConfiguration = RestConfConfigUtils.getDefaultRestConfConfiguration();

                // NETCONF SBP Default Configuration
                netconfSBPConfiguration = NetconfConfigUtils.createDefaultNetconfConfiguration();

                // OpenFlow SBP Default Configuration
                openflowSBPConfiguration = OpenflowConfigUtils
                        .getDefaultOfpConfiguration();
            }

            startMDSAL(singleNodeConfiguration, restConfConfiguration, netconfSBPConfiguration,
                    openflowSBPConfiguration, registerShutdownHook);
            logger.info("MD-SAL RESTCONF-NETCONF Service Started in {}" + stopwatch.stop());
        } catch (IOException cause) {
            logger.error("MD-SAL RESTCONF-NETCONF Service - Error Reading Configuraiton: ", cause);
        } catch (ConfigurationException | ExecutionException | InterruptedException cause) {
            logger.error("MD-SAL RESTCONF-NETCONF Service Exception: ", cause);
        }
    }

    /**
     * Starts the MDSAL Controller and the NB/SB Plugins with the provided JSON configuration.
     * 
     * @param controllerConfiguration Configuraiton for the MDSAL Controller.
     * @param restConfConfiguration Configuraiton for the RESTCONF Southbound Plugin.
     * @param netconfSBPConfiguration Configuraiton for the RESTCONF Southbound Plugin.
     * @param openflowSBPConfiguration Configuraiton for the RESTCONF Southbound Plugin.
     * @param registerShutdownHook Enable registration of Service shoutdwon hook.
     * @throws ConfigurationException
     * @throws ExecutionException
     * @throws InterruptedException
     */
    private void startMDSAL(ControllerConfiguration controllerConfiguration,
            RestConfConfiguration restConfConfiguration, NetconfConfiguration netconfSBPConfiguration, 
            OpenflowpluginConfiguration openflowSBPConfiguration, boolean registerShutdownHook) 
            throws ConfigurationException, ExecutionException, InterruptedException {

        // Initialize and Start MD-SAL Service (MD-SAL, Controller, YangTools, Akka)
        LightyControllerBuilder lightyControllerBuilder = new LightyControllerBuilder();
        LightyController lightyController = lightyControllerBuilder.from(controllerConfiguration).build();
        lightyController.start().get();

        // Start RestConf Server
        LightyServerBuilder jettyServerBuilder = new LightyServerBuilder(
                new InetSocketAddress(restConfConfiguration.getInetAddress(), restConfConfiguration.getHttpPort()));
        CommunityRestConf communityRestConf = CommunityRestConfBuilder.from(
                RestConfConfigUtils.getRestConfConfiguration(restConfConfiguration, lightyController.getServices()))
                .withLightyServer(jettyServerBuilder).withServletContext(servletContext).build();

        // Start Swagger
        SwaggerNOA swagger = new SwaggerNOA(restConfConfiguration, jettyServerBuilder, lightyController.getServices());
        swagger.start().get();
        communityRestConf.start().get();
        communityRestConf.startServer();

        // Start NetConf SBP
        LightyModule netconfSouthboundPlugin;
        netconfSBPConfiguration = NetconfConfigUtils.injectServicesToTopologyConfig(netconfSBPConfiguration,
                lightyController.getServices());
        netconfSouthboundPlugin = NetconfTopologyPluginBuilder
                .from(netconfSBPConfiguration, lightyController.getServices()).build();
        netconfSouthboundPlugin.start().get();

        // Start OpenFlow SBP
        OpenflowSouthboundPlugin openflowSouthboundPlugin;
        openflowSouthboundPlugin = OpenflowSouthboundPluginBuilder
                .from(openflowSBPConfiguration, lightyController.getServices())
                .withPacketListener(new PacketInListener())
                .build();

        ListenableFuture<Boolean> start = openflowSouthboundPlugin.start();

        //Set SystemReadyMonitor listeners to active state
        Futures.addCallback(start, new FutureCallback<>() {
            @Override
            public void onSuccess(Boolean result) {
                if (result != null && result) {
                    lightyController.getServices().getLightySystemReadyService().onSystemBootReady();
                } else {
                    logger.error("OFP wasn unable to start correctly");
                    throw new RuntimeException("Unexcepted result of OFP initialization");
                }
            }

            @Override
            public void onFailure(Throwable cause) {
                logger.error("Exception while initializing OFP", cause);
            }
        }, Executors.newSingleThreadExecutor());

        // Register Shutdown Hook for Graceful Shutdown.
        shutdownHook = new ShutdownHook(lightyController, communityRestConf, netconfSouthboundPlugin, 
                                            openflowSouthboundPlugin, swagger);
        if (registerShutdownHook) {
            Runtime.getRuntime().addShutdownHook(shutdownHook);
        }
    }

    public void shutdown() {
        shutdownHook.execute();
    }

    /**
     * Implements a Runnable for execution of graceful shutdown of Controller and NB/SB Plugins
     */
    private static class ShutdownHook extends Thread {

        private static final Logger logger = Logger.getLogger(ShutdownHook.class);
        private final LightyController lightyController;
        private final CommunityRestConf communityRestConf;
        private final LightyModule netconfSouthboundPlugin;
        private final LightyModule openflowSouthboundPlugin;
        private final SwaggerNOA swagger;

        /**
         * Initializes and binds the instances of Controller and SB/NB Plugins with the shutdown handler.
         */
        ShutdownHook(LightyController lightyController, CommunityRestConf communityRestConf,
                LightyModule netconfSouthboundPlugin, LightyModule openflowSouthboundPlugin, SwaggerNOA swagger) {
            this.lightyController = lightyController;
            this.communityRestConf = communityRestConf;
            this.netconfSouthboundPlugin = netconfSouthboundPlugin;
            this.openflowSouthboundPlugin = openflowSouthboundPlugin;
            this.swagger = swagger;
        }

        @Override
        public void run() {
            this.execute();
        }

        /**
         * Executes shutdown Procedures for the Controller and NB/SB Plugins
         */
        @SuppressWarnings({ "checkstyle:illegalCatch", "VariableDeclarationUsageDistance" })
        public void execute() {
            logger.info("MD-SAL RESTCONF-NETCONF Service Shutting Down ...");
            final Stopwatch stopwatch = Stopwatch.createStarted();
            try {
                swagger.shutdown().get();
            } catch (Exception e) {
                logger.error("Exception while Shutting Down Swagger:", e);
            }
            try {
                communityRestConf.shutdown().get();
            } catch (Exception e) {
                logger.error("Exception while Shutting Down RESTCONF:", e);
            }
            try {
                netconfSouthboundPlugin.shutdown().get();
            } catch (Exception e) {
                logger.error("Exception while Shutting Down NETCONF:", e);
            }
            try {
                openflowSouthboundPlugin.shutdown().get();
            } catch (Exception e) {
                logger.error("Exception while Shutting Down OpenFlow:", e);
            }
            try {
                lightyController.shutdown().get();
            } catch (Exception e) {
                logger.error("Exception while Shutting Down Controller:", e);
            }
            logger.info("MD-SAL Service stopped in {}" + stopwatch.stop());
        }
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }
}