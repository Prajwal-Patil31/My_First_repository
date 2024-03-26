SNMP Agent source code documentation
====================================

* Create Spring boot project or Maven build tool.

* Create a new file in src/package/(newfile) the project folder.

* Then create a file with .java extension.

* Add snmp4j , snmp4j-agent dependency from Maven repository.
:: 

   <!-- https://mvnrepository.com/artifact/org.snmp4j/snmp4j -->
   <dependency>
    <groupId>org.snmp4j</groupId>
    <artifactId>snmp4j</artifactId>
    <version>1.10.1</version>
   </dependency>

   <!-- https://mvnrepository.com/artifact/org.snmp4j/snmp4j-agent -->
   <dependency>
    <groupId>org.snmp4j</groupId>
    <artifactId>snmp4j-agent</artifactId>
    <version>1.3.1</version>
   </dependency>


* Write the agent code,below is referral code for snmp4j-agent.
.. image:: 1.png   
   :width: 400
   :alt: Alternative text
   
.. image:: 2.png   
   :width: 400
   :alt: Alternative text
   
.. image:: 3.png   
   :width: 400
   :alt: Alternative text

* Compile the code.

* Whenever you compile the code and run you need to get (SNMP Agent Listening on 127.0.0.1/1611) this message on your terminal.

* Now open the terminal in your system and check for SNMP status in your system.

* Command for checking SNMP status is: sudo service snmpd status.

* If SNMP service is off restart the service.

* Command for restarting service is: sudo service snmpd restart.

* If you want to stop SNMP service: sudo service snmpd stop.

* Next with inbuilt SNMP manager check the OID data.

* Command to check is: sudo snmpget -c public -v 2c 127.0.0.1.161 -d .1.3.6.1.4.1.18036.1.1.1

* If you are getting the data of perticular OID then your agent and manager are responding. 

* Finally your agent code is working.

* Here is complete explaination of code given below.

::
  
  public class Agent implements CommandResponder {
  
* This line defines class named 'Agent' that implements the CommandResponder interface.

::

   public static void main(String[] args) {
    Agent snmp4jTrapReceiver = new Agent();

* This is the main method of the program. It creates an object of the Agent class called snmp4jTrapReceiver.

::
 
   try {
    snmp4jTrapReceiver.listen(new UdpAddress("127.0.0.1/1611"));
      } catch (IOException e)
      {
      System.err.println("Error in Listening for Trap");
      System.err.println("Exception Message = " + e.getMessage());
      }
      
* This block of code will calls the listen method of the snmp4jTrapReceiver object. It provides a address "127.0.0.1/1611" as an argument. This address specifies that the agent should listen on the local machine at ip address 127.0.0.1 and port 1611 for incoming SNMP traps. If an exception occurs, it prints an error message.

::

   public synchronized void listen(TransportIpAddress address) throws IOException 
   {
    
* This is new method.Synchronized,is access modifier which means only one thread can execute this method at a time to ensure thread safety. The method takes a TransportIpAddress as an argument and can throw an IOException.

::

   AbstractTransportMapping transport;
   if (address instanceof TcpAddress) 
   {
   transport = new DefaultTcpTransportMapping((TcpAddress) address);
   } 
   else 
   {
   transport = new DefaultUdpTransportMapping((UdpAddress) address);
   }

* This section creates an object of either DefaultTcpTransportMapping or DefaultUdpTransportMapping based on the type of the provided address. It checks whether the address is an instance of TcpAddress or not. If it is, a TCP transport mapping is created otherwise, a UDP transport mapping is created.

::
 
   ThreadPool threadPool = ThreadPool.create("DispatcherPool", 10);

* A thread pool named "DispatcherPool" is created with a maximum of 10 threads. This pool will be used to manage the threads for processing incoming SNMP requests.

::

   MessageDispatcher mtDispatcher = new MultiThreadedMessageDispatcher(threadPool, new MessageDispatcherImpl());

* An object of MultiThreadedMessageDispatcher is created using the provided threadPool and a new instance of MessageDispatcherImpl. This dispatcher will handle processing of incoming SNMP messages.

::

   mtDispatcher.addMessageProcessingModel(new MPv1());
   mtDispatcher.addMessageProcessingModel(new MPv2c());

* The dispatcher is configured to handle SNMP message processing models. It adds two models: SNMPv1 (MPv1) and SNMPv2c (MPv2c).

:: 

   SecurityProtocols.getInstance().addDefaultProtocols();
   SecurityProtocols.getInstance().addPrivacyProtocol(new Priv3DES());

* The security protocols used by the SNMP agent are configured. Default security protocols are added, and the 3DES privacy protocol is also added.

::

   CommunityTarget target = new CommunityTarget();
   target.setCommunity(new OctetString("public"));
   
* A CommunityTarget object is created and configured with the community string "public". This is used to define the target for SNMP communication.

::

   Snmp snmp = new Snmp(mtDispatcher, transport);
   snmp.addCommandResponder(this);
* An object of the Snmp class is created, which manages SNMP operations. It is initialized with the mtDispatcher and transport created earlier. The agent itself is added as a CommandResponder to handle incoming SNMP commands.

::

   transport.listen();
   System.out.println("SNMP Agent Listening on " + address);
   
* The transport mapping starts listening for incoming SNMP messages. A message is printed to indicate that the agent is now listening on the specified address.

::
  
   try {
   this.wait();
   } catch (InterruptedException ex) {
   Thread.currentThread().interrupt();
   }

* The current thread the main thread is put in a waiting state using the wait() method. This effectively keeps the program running and waiting for incoming SNMP commands. If the waiting thread is interrupted due to a different thread interrupting it, the interruption status of the current thread is set back.


