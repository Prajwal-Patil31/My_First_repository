Documentation of understanding from the seminar-30/09/2023 
==========================================================

* I wanted to share my thoughts and takeaways from today's seminar class, which I found immensely informative and engaging. The session covered various aspects of network topology, the FCAPS standard in the telecom industry, an introduction to multiple network protocols, and an overview of ITU-T.

What is FCAPS ?
---------------

* FCAPS stands for fault, configuration,  Accounting, Performance, Security these standards are used in the telecom industry. It is used essential for managing and maintaining network devices effectively. 

What are diffrent types of Network topology ?
---------------------------------------------

* Diffrent type of network topology are peer-to-peer network and linear air drop. 

::
   
  peer-to-peer network is a decentralized communication model where each connected device, or "peer," has equal status and can both send and receive data directly to or from other peers.     


.. image:: peer.jpg
          :width: 600
          :alt: Alternative text
          

::

   Linear bus topology is a type of network topology where each device connects one after the other in a sequential chain.
   In this case, the bus is the network connection between the devices. 
   If any link in the network chain is severed, all network transmission is halted. 
   It works effectively for small networks because it is simple to set up and utilizes shorter cables since each device  connects to the next. 
  

.. image:: linear.jpg
          :width: 600
          :alt: Alternative text  
          

Concepts to understand  and their duration required
---------------------------------------------------

Concepts  ----------------------------    Time required 

1.SNMP & MIB -------------------------    2days(16hrs)
 
2.Netconf & yang ---------------------    2days(16hrs)

3.gRPC ------------------------------    1.5day(12rhs)

4.RESTCONF --------------------------    1.5day(12rhs)

5.Telecommunications Management Network-- 1day(8hrs)


Tasks to be completed on-30/09/2023 
-----------------------------------

1. Connect the DWDM system to your local system, get access to the system. 

::
  
  steps first ON the DWDM system, then find the IP address of that system ping that IP in your system check whether the response is coming or not then type command ssh root@192.168.21.46<- - -ip.
  Now you can access that system files.
  
2. Locate all the MIB files stored in the system, read all the MIB files, Through the iResoning mib browser add the mib file, and query the OID parameters.    

::
 
  steps once successfully connected then go to this path /home/root/.neutron/rel -1.0.0.138/neutron/lib/neutron 1.3.8/private/mibs.
  Here all the mib files will be present. Then copy the MIB file or Folder to your home directory add the file to iReasoning mib browser and make a query with OID.
  
3. By using our SNMP manager application query the mib files of the DWDM system and understand how flexible our code is to change.  
                    
