Nginx documentation
===================

  1.Introduction
  
  2.Installation
  
  3.Adjusting the firewall
  
  4.Checking web server
  
  5.Managing the nginx process
  
  6.Setting up server blocks

Introduction:
-------------
Nginx is one of the most popular web servers in the world and is responsible for hosting some of the largest and highest-traffic sites on the internet. 
It is a lightweight choice that can be used as either a web server or reverse proxy.
It started out as a web server designed for maximum performance and stability.

Installation:
-------------
Using apt package we can install Nginx because Nginx is available in Ubuntu’s default repositories.
Since this is our first interaction with the apt packaging system in this session, we have to update our local package index so that we have access to the most recent package listings. Afterwards, we can install nginx.


.. code-block:: C
   :caption: **commands** 
    
     sudo apt update
     sudo apt install nginx

Then press Y when prompted to confirm installation and then apt will install Nginx and any required dependencies to your server.

Adjusting the firewall:
-----------------------
Before testing Nginx, the firewall software needs to be configured to allow access to the service. Nginx registers itself as a service with ufw upon installation, making it straightforward to allow Nginx access.
List the application configurations that ufw knows how to work with by typing.


.. code-block:: C
   :caption: **command**
   
   $sudo ufw app list

Then will get some list of application profiles.


.. code-block:: C
   :caption: **Available applications:**
   
   Nginx Full
   Nginx HTTP
   Nginx HTTPS
   OpenSSH
  
Right now, we will only need to allow traffic on port 80.
We can enable this by typing.


.. code-block:: C
   :caption: **command**
   
   $sudo ufw allow 'Nginx HTTP'

We can verify the change by typing.


.. code-block:: C
   :caption: **command**
   
   $sudo ufw status

Then we will get status of that, it shoul be `active`.

Checking web server:
--------------------
At the end of the installation process, Ubuntu 22.04 starts Nginx. The web server should already be up and running.

We can check with the system to make sure the service is running by typing.


.. code-block:: C
   :caption: **command**
   
   $sudo systemctl status nginx

Then it will shows the confirmation message like server has started successfully.

Then enter your IP address into your browser bar then you will get default NGINX page.
If we got that page means then our server is running correctly and is ready to be managed.

Managing the nginx process:
---------------------------
To re-enable the service to start up at boot, you can type.



.. code-block:: C
   :caption: **command**
   
   $sudo systemctl enable nginx

To stop and then start the service again, type.


.. code-block:: C
   :caption: **command**
   
   $sudo systemctl restart nginx

Setting up server blocks:
-------------------------
First, we should change our directory path by typing this.


.. code-block:: C
   :caption: **command**
   
   $cd /var/www/

Then, we have to create one directory by using this command.


.. code-block:: C
   :caption: **command**
   
   $sudo mkdir nginx

After creating the directory we have to copy our html path.


.. code-block:: C
   :caption: **command**
   
   $sudo cp -R /home/ranjitha/nginx/build/html nginx
   
Then, we have came out of those directories by typing this.

.. code-block:: C
   :caption: **command**
  
   $cd ../../

Then, we should change our directory path by typing this.

.. code-block:: C
   :caption: **command**
   
   $ cd /etc/nginx/

Then it will go inside that above mentioned directory.
After that we have check the list of contents and files by typing this.


.. code-block:: C
   :caption: **command**
   
   $ls

Then it will give some directories and files among those directories we have to go inside sites-avilable folder, to do that we have to change our path so we have type this below command.


.. code-block:: C
   :caption: **command**
   
   $ cd sites-avilable/

Then we will go inside the sites-avilable folder and then we have to check the list for confirmation, so we have to type this command.
sites-avilable folder holds all our sites configuarations.


.. code-block:: C
   :caption: **command**
   
   $ls

Then we have to modify the default file becuase of adding IP address of our host. By using this commands.



.. code-block:: C
   :caption: **command**
   
   $sudo nano default

After adding our IP address we have to save that file by giving ctrl+x and y and enter.

Then we have to came out of that sites-avilable folder by typing this.


.. code-block:: C
   :caption: **command**
   
   $cd../

After that again we have change our path to sites-enabled by typing this.


.. code-block:: C
   :caption: **command**
   
   $cd sites-enabled/

In this sites-enabled folder you create symboliclinks(symlink) to the previous folder for the sites you wish to enable.
After that we have check the list for confirmation by using this command.

Then we have to create symbolic link by using `ln -s` commad.


.. code-block:: C
   :caption: **command**
   
   $sudo ln -s ../sites-available/default default

It will create the symbolic link.

we have to test that by typing this.


.. code-block:: C
   :caption: **command**
   
   $sudo nginx -t

If we got successfull meassage then we successfully hosted our document and we can access it though other system also.

Final step is to restart our server nginx by typing this.


.. code-block:: C
   :caption: **command**
   
   $sudo systemctl restart nginx

It will restart the server for updating any changes made by us.


