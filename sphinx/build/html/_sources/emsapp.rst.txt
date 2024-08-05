Update node functionality
-------------------------

The updateNode functionality in the EMS application allows for the modification of information about a node, such as its name, IP address, and location. This functionality is implemented through a combination of controller, service, and repository classes in a Spring Boot application.

Controller Class (HomeController):
++++++++++++++++++++++++++++++++++

Below is the controller class code and its explaination.


::
   
   @RequestMapping(path = "/update", method = RequestMethod.PUT)
    public ResponseEntity<NodeEntity> updateNode(@RequestBody NodeEntity nodeEntity)
     {
      try
       {
        this.serviceImple.updateNode(nodeEntity);
        return new ResponseEntity<>(nodeEntity, HttpStatus.OK);
         }
          catch (Exception e)
           {
           return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
             }

  
* The controller class is responsible for handling incoming HTTP requests related to nodes.

* It has an updateNode method that listens for HTTP PUT requests at the path "/ems/update."

* When a PUT request is received, it expects a JSON representation of a "NodeEntity" in the request body.

* It calls the service class's updateNode method to carry out the update operation.

* If the update is successful, it returns an HTTP response with the updated "NodeEntity" and an HTTP status of 200 (OK).

* If an error occurs during the update, it returns an HTTP status of 500.


Service Class (ServiceImplementation):
++++++++++++++++++++++++++++++++++++++

Below is the service class code and its explaination.

::

  @Override
    public NodeEntity updateNode(NodeEntity nodeEntity)
    {
    Optional<NodeEntity> existingNode = nodeRepository.findById(nodeEntity.getId());
    NodeEntity updaTe = new NodeEntity(); 
    if (existingNode.isPresent()) 
    {
        NodeEntity existingNodeData = existingNode.get();
        existingNodeData.setName(nodeEntity.getName());
        existingNodeData.setIp(nodeEntity.getIp());
        existingNodeData.setAddress(nodeEntity.getAddress());
        updaTe = nodeRepository.save(existingNodeData); 
    }
     else
      {
        updaTe.setId(nodeEntity.getId());
        updaTe.setIp(nodeEntity.getIp());
        updaTe.setAddress(nodeEntity.getAddress());
        updaTe.setName(nodeEntity.getName());
        updaTe = nodeRepository.save(updaTe);
         }

         return updaTe;
          }
          
          
* The service class contains the business logic for updating a node.

* It's responsible for communicating with the repository database and performing the actual update.

* In the updateNode method, it first checks if a node with the same ID exists in the repository by using the ID provided in the input "NodeEntity."

* If the node exists based on the ID, it updates the node's name, IP, and location with the information from the input "NodeEntity" and saves the updated node in the repository.

* If the node doesn't exist based on the ID, it creates a new "NodeEntity" and sets its ID, name, IP, and location with the information from the input. This new entity is then saved in the repository.

* Finally, it returns the updated or newly created "NodeEntity".


Repository Class (NodeRepository):
++++++++++++++++++++++++++++++++++


Below is the Repository class code and its explaination.

::

  
  @Repository
  public interface NodeRepository extends JpaRepository<NodeEntity,Integer>
  {
    
  }          
  
* The repository class extends the JpaRepository interface, which provides builtin methods for interacting with the database.

* It handles the storage and retrieval of "NodeEntity" objects in the database.  
