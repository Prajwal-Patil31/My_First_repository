Building client application for gremlin server
==============================================

**Overview**

Building client application for gremlin server running with janusgraph. First, if your gremlin server is up in janusgraph then with the gremlin console try to add vertex and fetch it. 
To run the gremlin console you need to run ./bin/gremlin.sh. Once you have successfully executed remotely, then try to connect the gremlin client with your local system by following the below steps. Later write simple Java code to connect with the gremlin server running on your virtual machine.  

**Steps to connect gremlin client to gremlin server remotely**

1) First verify that your janusgraph and gremlin server is up, by giving below command.
::
   
   ./bin/janusgraph.sh -v status 
  
2) If you are able to see PID then start gremlin console in it by below given command.

::

   ./bin/gremlin.sh
   
3) Then you will see below logs like below mentioned. 

.. code-block:: C
   :caption: **Output**
   
            \,,,/
            (o o)
   -----oOOo-(3)-oOOo-----
   plugin activated: tinkerpop.server
   plugin activated: tinkerpop.utilities
   plugin activated: tinkerpop.tinkergraph
   gremlin> 
   
4) Now enter into remote console by giving perticular command. 

::
  
   :remote connect tinkerpop.server conf/remote.yaml
 
5) Once you are successfully connected you will receive logs as below.

.. code-block:: C
   :caption: **Output**
   
   ==>Configured 192.168.21.121/192.168.21.121:8182          
   
6) Now switch your console to remote by below command and you will receive certain logs as follows.

::
  
   :remote console
   
 
.. code-block:: C
   :caption: **Output**
   
    ==>All scripts will now be sent to Gremlin Server - [192.168.21.121/192.168.21.121:8182] - type ':remote console' to return to local mode
    
7) Try to add and fetch vertex by below given command.
 
.. code-block:: C
    :caption: **Add vertex**
    
    g.addV('company').property('name','United')
    ==>v[4232]
  
.. code-block:: C    
    :caption: **Fetch vertex**
    
    gremlin> g.V(4232).valueMap()
    ==>{name=[United]}
    gremlin> 
       
8)  To check whether my vertex is getting stored or not below is the log output which shows that the data is present in cassendrs.

.. code-block:: C
   
   prajwal@prajwal:~/noa/janusgraph-full-1.0.0$ ls
   bin  cassandra  conf  data  db  elasticsearch  examples  ext  javadocs  lib  LICENSE.txt  logs  NOTICE.txt  scripts
   prajwal@prajwal:~/noa/janusgraph-full-1.0.0$ cd cassandra/
   prajwal@prajwal:~/noa/janusgraph-full-1.0.0/cassandra$ ls
   bin  CASSANDRA-14092.txt  CHANGES.txt  conf  data  lib  LICENSE.txt  logs  NEWS.txt  NOTICE.txt  pylib  tools
   prajwal@prajwal:~/noa/janusgraph-full-1.0.0/cassandra$ cd bin/
   prajwal@prajwal:~/noa/janusgraph-full-1.0.0/cassandra/bin$ ls
   cassandra  cassandra.in.sh  cqlsh  cqlsh.py  debug-cql  nodetool  sstableloader  sstablescrub  sstableupgrade  sstableutil  sstableverify  stop-server
   prajwal@prajwal:~/noa/janusgraph-full-1.0.0/cassandra/bin$ ./cqlsh
   Connected to JanusGraph Cassandra Cluster at 127.0.0.1:9042
   [cqlsh 6.0.0 | Cassandra 4.0.6 | CQL spec 3.4.5 | Native protocol v5]
   Use HELP for help.
   cqlsh> DESCRIBE KEYSPACES;

   janusgraph  system_auth         system_schema  system_views         
   system      system_distributed  system_traces  system_virtual_schema

   cqlsh> USE janusgraph ;
   cqlsh:janusgraph> DESCRIBE TABLES;

   edgestore        graphindex_lock_   system_properties_lock_
   edgestore_lock_  janusgraph_ids     systemlog              
   graphindex       system_properties  txlog                  

   cqlsh:janusgraph> SELECT * FROM edgestore;

   key | column1 | value
   -----+---------+-------

   (0 rows)
   cqlsh:janusgraph> 
   

Connecting gremlin server locally          	
---------------------------------

1) I had followed following document the link is given below.
 
:: 
  
   https://docs.aws.amazon.com/neptune/latest/userguide/access-graph-gremlin-console.html
   
2) Remember you need to connect server with below given command 

::
  
   :remote connect tinkerpop.server conf/remote.yaml   

3) In this remote.yaml file you will havae to configure ip address of your host system.

Connecting gremlin server through java code
-------------------------------------------

* Below is the code given to connect with gremlin server follow make shure the version of janusgraph and serilization of data.

.. code-block:: C

   import org.apache.tinkerpop.gremlin.driver.remote.DriverRemoteConnection;
   import org.apache.tinkerpop.gremlin.driver.ser.Serializers;
   import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversalSource;
   import org.apache.tinkerpop.gremlin.driver.Cluster;
   import static org.apache.tinkerpop.gremlin.process.traversal.AnonymousTraversalSource.traversal;
   import org.apache.tinkerpop.gremlin.structure.Vertex;

    public class App 
   {
    public static void main(String[] args) throws Exception 
    {
     Cluster cluster = null;
        try {
            cluster = remoteAddVertex();
             }
              finally 
              {
               if (cluster != null)
                {
                 cluster.close(); 
                }
              }
    }

    public static Cluster remoteAddVertex() throws Exception 
    {
     Cluster cluster = createCluster();
     GraphTraversalSource g = traversal().withRemote(DriverRemoteConnection.using(cluster));
     try 
     {
       Vertex addedVertex = g.addV("province").property("country", "british colombia").next();
       System.out.println("Vertex added with ID: " + addedVertex.id());
        }
        finally 
        {
        g.close(); // Close the traversal source
        }
        return cluster;
    }
    
  

    private static Cluster createCluster()
    {
    return Cluster.build()
    .addContactPoint("192.168.21.121")
    .port(8182)
    .enableSsl(false)
    .minConnectionPoolSize(1)
    .maxConnectionPoolSize(10)
    .maxWaitForConnection(200000)
    .serializer(Serializers.GRAPHSON)
    .create();
    }
    } 
    
    
* Here are the required dependencies to run this code.

.. code-block:: C

    <groupId>com.tinkerpop</groupId>
    <artifactId>gremlin-core</artifactId>
   <version>3.0.0.M7</version>
   </dependency>
   <dependency>
   <groupId>org.janusgraph</groupId>
   <artifactId>janusgraph-core</artifactId>
   <version>0.5.2</version>
   </dependency>
   <dependency>
   <groupId>org.janusgraph</groupId>
   <artifactId>janusgraph-cql</artifactId>
   <version>0.5.3</version>
   <scope>test</scope>
   </dependency>
   <dependency>
   <groupId>org.janusgraph</groupId>
   <artifactId>janusgraph-es</artifactId>
   <version>0.5.3</version>
   <exclusions>   
   <exclusion>
   <groupId>org.elasticsearch</groupId>
   <artifactId>elasticsearch</artifactId>
   </exclusion>
   </exclusions>
   </dependency>
   <dependency>
   <groupId>software.amazon.neptune</groupId>
   <artifactId>gremlin-client</artifactId>
   <version>1.0.2</version>
   </dependency>
   <dependency>
   <groupId>org.apache.tinkerpop</groupId>
   <artifactId>tinkergraph-gremlin</artifactId>
   <version>3.3.3</version>
   </dependency>
   <dependency>
   <groupId>com.tinkerpop.gremlin</groupId>
   <artifactId>gremlin-java</artifactId>
   <version>2.6.0</version>
   </dependency>
   
   
