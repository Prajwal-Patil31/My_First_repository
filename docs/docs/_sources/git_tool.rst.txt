Git tool documentation
======================

1.Introduction
--------------

What is version control system?
-------------------------------

Version control systems are software tools that help software teams manage changes to source code over time.

Version control is important for keeping track of changes to code, files, and other digital assets. 

The types of VCS are:

1.Local Version Control System.

2.Centralized Version Control System.

3.Distributed Version Control System. 

What is git?
------------

Git is a distributed type of version control system.

Git is a source version control system used to handle small to very large projects efficiently. 

Git is used to tracking changes in the source code, enabling multiple developers to work together on non-linear development.
 
It saves the history of all changes made to the files in a Git project. 

It saves this data in a directory called .git , also known as the repository folder.

Some git terminologies
----------------------

**STAGED:** `You stage a file in Git, you instruct Git to track changes to the file in preparation for a commit.`

**UNSTAGED:** `Unstaged changes are changes that are not tracked by the Git. The file which is modified but it is not added to index.`

**INDEX:** `It's a staged area where our files are ready to be committed`

**HEAD:** `It's a name of the pointer and it's pointing to last commit`

**HASH-KEY:** `It creates object ID value for an object with the contents of the named file.`

**BRANCH:** `It's directed to newly modified and committed file.`

**MASTER:** `It's a default branch name.`

**MERGING:** `Merging is Git's way of putting a forked history back together again.`

**FAST FORWARD MERGING:** `Fast forward merge can be performed when there is a direct linear path from the source branch to the target branch. In fast-forward merge, git simply moves the source branch pointer to the target branch pointer without creating an extra merge commit.`

**RECURSIVE MERGING:** `This operates on two heads. Recursive is the default merge strategy when pulling or merging one branch. Additionally this can detect and handle merges involving renames, but currently cannot make use of detected copies.`

**CLONING:** `Git clone is primarily used to point to an existing repo and make a clone or copy of that repo at in a new directory, at another location.` 





2.Installation of git
---------------------

If we want to install the git tool in our system, we have to type the below command:

.. code-block:: C
   :caption: **command**
   
   $sudo apt-get install git-core
   
   
Setup name and email
--------------------
 
 After installing the git we have to setup the git by using user-name and email, we have to type the below command to setup the git tool:   
 
.. code-block:: C
   :caption: **command**
   
   $git config --global user.name "Prajwal"
   $git config --global user.email "prajwal.patil@priyarajaelectronics.com"
   
Create directory
----------------

After setup of uname and email, we have to create one directory using below command:

.. code-block:: C
   :caption: **command**
   
   $mkdir myproject
   
After creating directory we have change the directory path to newly created directory. we can done this using below command:

.. code-block:: C
   :caption: **command**
   
   $cd myproject   #working directory is created
   
Checking directory
------------------
   
After that we have check whether that directory is empty or not by using below command:

.. code-block:: C
   :caption: **command**
   
   $ls -al     

Initilizing the git
-------------------
   
Then we have to initialize the git for creating git repository by using below command:

.. code-block:: C
   :caption: **command**
   
   $git init    #initialize git repository
   
Again we have to check the directory files just becuase of confirmation whether the repository file is created or not by using below command:

.. code-block:: C
   :caption: **command**
   
   $ls -al            
   
Checking the status
-------------------

After creation of repository we have to check the status of both index and working directory by using below command:

.. code-block:: C
   :caption: **command**
   
   $git status   #shows the status of index and working directory
   
Creating a file
---------------

After checking the status of both index and working directory, we have to create a file using below command:

.. code-block:: C
   :caption: **command**
   
   $cat > hello.txt
   
Add that file to index
----------------------

After creating a file we have to add that file to index to start tracking that file, so that git will remember what file have been added.

.. code-block:: C
   :caption: **command**
   
   $git add hello.txt    #add content to index
   
   
Check the status
----------------

After adding that file to index again we have to check the status of the both index and working directory by using below command:

.. code-block:: C
   :caption: **command**
   
   $git status
   
Commit
------

After adding the created file into index it'll be in staging area so we have to send this to repository by using below command:

.. code-block:: C
   :caption: **command**
   
   $git commit    #make a commit
   
If we give above command it will open a text editor window then inside that text editor we have to give a message then it will commit that file inside the repository.

Instead of giving the message inside the text editor we can give it directly by using below command:

.. code-block:: C
   :caption: **command**
   
   $git commit -m"message"
   
After that we have to check the status of the repository by using below command:

.. code-block:: C
   :caption: **command**
   
   $git status
   
   
so successfully created our repository.

Make some changes in files
--------------------------

Let's see if we did any changes inside the excisting file means how it will be stores that and how it will be track that.

For doing some changes inside file we have to use below command:

.. code-block:: C
   :caption: **command**
   
   $cat >> hello.txt
   
   
Review
------

Let's review the changed file by checking the status

.. code-block:: C
   :caption: **command**
   
   $git status
   
   
See the diffrence
-----------------

We can use the below command to see the difference between index and working directory. 

.. code-block:: C
   :caption: **command**
   
   $git diff
   
   
Add the file
------------

After made some changes in excisting file we have to add that file to index means stage that changes made by using below command:

.. code-block:: C
   :caption: **command**
   
   $git add -p   
   
   
It will interactively add that changed chunk.

See the diffrence
-----------------

Again see the difference between index and working directory. 

.. code-block:: C
   :caption: **command**
   
   $git diff 
   
If we want to check the difference between index and repository use the below command.


.. code-block:: C
   :caption: **command**
   
   $git diff --staged
   $git diff --cached
   
If we want to check the difference between working directory and repository by using below command.

.. code-block:: C
   :caption: **command**
   
   $git diff HEAD
   
Commit
------

After checking the difference we have to commit that file to repository by using the below command.


.. code-block:: C
   :caption: **command**
   
   $git commit -m"meassage"
   
This time we commit with -m, where we can give commit message.


Check the status
----------------

After the file is committed we have to check the status by using below commit:

.. code-block:: C
   :caption: **command**
   
   $git  status
   
   
Checking the history
--------------------

We can see what we have done so far by using below command

.. code-block:: C
   :caption: **command**
   
   $git log    #history
   
   
It will display the history what we have committed so far. 

                   
3.How to "Reset and goback to the earlier commit" 
-------------------------------------------------

To rollback to the pevious commit we use reset command.

It will vanish last commited and file which is in index but not in working directory because the file which is in working directory is still not in tracking.

To demonstrate this process first, I'll create some file and also modify one of the excisting file.


.. code-block:: C
   :caption: **command**
    
    $cat >> hello.txt
    welcome to utl
    
    $touch a.c
    $touch b.c
    $touch c.c
    
    
After creating of files and modified the content then, among them I'll add and commit the two files.
   
.. code-block:: C
   :caption: **command**
    
    $git add a.c b.c
    $git commit -m"i am adding two files a.c and b.c"
    
After adding and committing those two files, I'll add the modified file hello.txt to index.
  
.. code-block:: C
   :caption: **command**
    
    $git add hello.txt
    
After adding hello.txt, c.c file remains in working directory.

Now I'm giving reset command

.. code-block:: C
   :caption: **command**
    
    $git reset --hard HEAD^
    
After giving this command, It'll vanish the last committed files (a.c and b.c) and the file which is in index that is hello.txt will vanished.

For confirmation we can check the status by using below command.

.. code-block:: C
   :caption: **command**
    
    $git status
    
          
4.Branching and merging
-----------------------

Creating branch
---------------

It's directed to newly modified and committed file.

We already have default branch called master.

Our working directory defaultly points to branch called master. 

First, I will check the available branches

.. code-block:: C
   :caption: **command**
    
    $git branch
    
.. code-block:: C
   :caption: **output**
    
    *master

Creating another branch.

.. code-block:: C
   :caption: **command**
    
    $git branch uppercase
    
It will create a branch called uppercase.


Then, again I'll check the available branches

.. code-block:: C
   :caption: **command**
    
    $git branch -v
    

.. code-block:: C
   :caption: **output**
    
    *master f9a4126 committed message
    uppercase f9a4126 committed message    

                  
Currently I'm in master branch. Now I have to move to uppercase branch.

.. code-block:: C
   :caption: **command**
    
    $git checkout uppercase
    
Inside the branch I'll open the hello.txt file and modified some changes in that file.

.. code-block:: C
   :caption: **command**
    
    $cat >> hello.txt
    welcome to priyarajaelectronics
    
After modified, we need to add and commit that file.

.. code-block:: C
   :caption: **command**
    
    $git add hello.txt
    $git commit -m"adding modified file"
    
Then again I'll check the avilable branches.

.. code-block:: C
   :caption: **command**
    
    $git branch -v
    

.. code-block:: C
   :caption: **output**
    
    master f9a4126 committed message
    *uppercase 2323413 adding modified file
    
                        
Merging the branch 
------------------
 
Merging is Git's way of putting a forked history back together again.
 
Merging techniques are:
 
**1.Fast Forward Merging:**
 
Fast forward merge can be performed when there is a direct linear path from the source branch to the target branch. In fast-forward merge, git simply moves the source branch pointer to the target branch pointer without creating an extra merge commit.
 
In Fast Forward Merging, merged branch was a direct descendent.

Here is the practiced example for Fast Forward Merging:

.. code-block:: C
   :caption: **command**
    
    $git merge uppercase
    


.. code-block:: C
   :caption: **output**
    
    Updating f9a4..126
    Fast-forward
    hello.txt | 1 +
    1 file changed, 1 insertion(+)
    
    
**2.Recursive Merging:**  
  
Recursive Merging also known as Three way Merging.
  
This operates on two heads. Recursive is the default merge strategy when pulling or merging one branch. Additionally this can detect and handle merges involving renames, but currently cannot make use of detected copies.
  
Here is the practiced example for Recursive Merging:
  
First, I'll move to uppercase branch
  
.. code-block:: C
   :caption: **command**
    
    $git checkout uppercase
    
.. code-block:: C
   :caption: **output**
    
    Switched to branch 'uppercase'
    
After switching to uppercase branch, I'll open the hello.txt file and I'll do some modification in thet file.


.. code-block:: C
   :caption: **command**
    
    cat >> hello.txt
    welcome to child company 
    
Then I'll add the hello.txt file to index
 
.. code-block:: C
   :caption: **command**
    
    $git add hello.txt
 

After adding the hello.txt we need to commit it    

.. code-block:: C
   :caption: **command**
    
    $git commit -m"edited and commiting hello.txt in uppercase branch"
    


.. code-block:: C
   :caption: **output**
         
         [uppercase d98f28e] edited and commiting hello.txt in uppercase branch
                1 file changed, 1 insertion(+)   
                       
After committed the hello.txt file, I'll move from uppercase branch to master branch

.. code-block:: C
   :caption: **command**
    
    $git checkout master
    

.. code-block:: C
   :caption: **output**
    
       Switched to branch 'master' 
    
After switching to master branch, I'll create new file a.a

.. code-block:: C
   :caption: **command**
    
    cat > a.a
    This is a.a file
    
Then I'll add the a.a file to  index

.. code-block:: C
   :caption: **command**
    
    $git add a.a
    
After adding the a.a file, we have to do commit that file.

.. code-block:: C
   :caption: **command**
    
    $git commit -m"committing a.a"
    
.. code-block:: C
   :caption: **output**
       
        [master a9f42ce] committing a.a
        1 file changed, 1 insertion(+)               


Now I am going to do merging    
 
.. code-block:: C
   :caption: **command**
    
    $git merge uppercase 
    
Then it will open the editor window for giving commit message why becase it is recursive merging. After giving commit message one new commit will be created. Then we can do merge.

.. code-block:: C
   :caption: **command**
    
    $git merge uppercase 


.. code-block:: C
   :caption: **output**
      
      Merge made by the 'ort' strategy.
      hello.txt | 2 ++
       1 file changed, 2 insertions(+)
   
Then master will point to that new created commit. 
 
**How to solve the conflicts while merging**
 
First, I'll move to uppercase branch
  
.. code-block:: C
   :caption: **command**
    
    $git checkout uppercase
    

.. code-block:: C
   :caption: **output**
    
    Switched to branch 'uppercase'
    
After switching to uppercase branch, I'll open the hello.txt file and I'll do some modification in thet file.


.. code-block:: C
   :caption: **command**
    
    cat >> hello.txt
    hii this is saara 
    
Then I'll add the hello.txt file to index
 
.. code-block:: C
   :caption: **command**
    
    $git add hello.txt
 
After adding the hello.txt we need to commit it    

.. code-block:: C
   :caption: **command**
    
      $git commit -m"i'm commiting hello.txt from uppercase branch"
    

.. code-block:: C
   :caption: **output**
      
         [uppercase 36b042d] i'm commiting hello.txt from uppercase branch
            1 file changed, 1 insertion(+)  
   
                      
After committed the hello.txt file, I'll move from uppercase branch to master branch

.. code-block:: C
   :caption: **command**
    
    $git checkout master
    

.. code-block:: C
   :caption: **output**
    
    Switched to branch 'master' 
    
After switching to master branch, I'll create new file hello.txt and made some changes in that file

.. code-block:: C
    :caption: **command**
    
    cat >> hello.txt
    hii this is gill
    
Then I'll add the hello.txt file to  index

.. code-block:: C
   :caption: **command**
    
    $git add hello.txt
    
After adding the a.a file, we have to do commit that file.

.. code-block:: C
    :caption: **command**
    
    $git commit -m"i'm commiting hello.txt from master branch"
    

.. code-block:: C
    :caption: **output**
    
    [master 66e410a] i'm commiting hello.txt from master branch
    1 file changed, 1 insertion(+)             


Now I am going to do merging    
 
.. code-block:: C
   :caption: **command**
    
    $git merge uppercase   
    

.. code-block:: C
   :caption: **output**
    
    Auto-merging hello.txt
   CONFLICT (content): Merge conflict in hello.txt
   Automatic merge failed; fix conflicts and then commit the result.  
   
we will get conflicts while merging. So we have to clear those conflicts before merging. 

To do that we have to open the hello.txt file and clear the conflicts and then we have add and commit that file.

If we open the file it will shows like this

 

.. code-block:: C
   :caption: **shows**
       
       
       cat hello.txt
       Welcome to priyaraja electronics
       Welcome to utl
       WELCOME TO PARENT COMPANY
      welcome to child company 
      <<<<<<< HEAD
      hii this is gill
      =======
      hii this is saraaa
      >>>>>>> uppercase
      
Then we have to clear those conflicts using editor window.

.. code-block:: C
   :caption: **command**
    
    $nano hello.txt
    
Then we have to save the modification.

After saved that hello.txt file we have to do add and commit.

.. code-block:: C
   :caption: **command**
    
    $git commit -am"clearing conflicts and commiting it"
    
.. code-block:: C
   :caption: **output**
    
    [master 583a557] clearing conflicts and commiting it    
    
Then conflicts are cleared now we can do merging.

.. code-block:: C
   :caption: **command**
    
    $git merge uppercase
    
.. code-block:: C
   :caption: **output**
    
    Already up to date.
           
      
We can see the history of the branches by using below command.

.. code-block:: C
   :caption: **command**
    
    $git reflog
    
See the commit log with graph structure

.. code-block:: C
   :caption: **command**
   
      $ git log --graph    
    
We can check the difference between two branches by using the below command.

.. code-block:: C
   :caption: **command**
    
    $git diff master uppercase
    
How to change the branch
------------------------

If we wanto to checkout from one branch to another branch we can use the below command.

.. code-block:: C
   :caption: **command**
    
    $git checkout branch_name    

Deleting the branch
-------------------
    
We can delete the given branch

.. code-block:: C
   :caption: **command**
    
      $ git branch –d uppercase   
    
It will delete the branch uppercase and only reference will be there. 


5.Sharing and working in team
-----------------------------

So far we track our files in local repository so we can't able to access those files globally.

So if we create remote repository means then we can access and track all files globally.

Now we are going work on remote repository.

So that we can track our files by using remote repository so those files can be globally accessible. 



Before start our work let's check whether our system have any remote repository or not by using the below git command.

.. code-block:: C
   :caption: **command**
    
    $git remote -v
    
It displays nothing, why because we didn't have any remote repository . 

To access the remote repository we have to follow the below steps:
------------------------------------------------------------------
   

Step1: Generating and adding a SSH Key
--------------------------------------

**SSH Key:** An SSH key is an access credential for the SSH (secure shell) network protocol. 

This authenticated and encrypted secure network protocol is used for remote communication between machines on an unsecured open network. 

SSH is used for remote file transfer, network management, and remote operating system access. 

The SSH acronym is also used to describe a set of tools used to interact with the SSH protocol.

SSH uses a pair of keys to initiate a secure handshake between remote parties. The key pair contains a public and private key.

**How to generate SSH Key**

We need to open the terminal and type the below command to generate the SSH key.

.. code-block:: C
   :caption: **command**
    
      $ ssh-keygen -t ed25519 -C "prajwal.patil@priyarajaelectronics.com"
      
      

.. code-block:: C
   :caption: **output**
    
      Generating public/private ed25519 key pair.
      Enter file in which to save the key (/home/prajwal/.ssh/id_ed25519): 
      Enter passphrase (empty for no passphrase): 
     Enter same passphrase again: 
     Your identification has been saved in /home/prajwal/.ssh/id_ed25519
    Your public key has been saved in /home/prajwal/.ssh/id_ed25519.pub
    The key fingerprint is:
    SHA256:hiD+ZK/8Y0LskzeT++6xRLo2WZmiAZCFSXaOpG2YfRk prajwal.patil@priyarajaelectronics.com
    The key's randomart image is:
    +--[ED25519 256]--+
    |.O..E            |
    |O=+  o           |
    |+o=.+            |
    | o.o . .         |
    |  .oo . So       |
   |   ++..++        |
   |   o.+o=o        |
   |   .*.@o o       |
   |    oB+X=        |
   +----[SHA256]-----+


**Adding the SSH Key**

->First we have to go to our profile.

->Then click on SSH key.

->Then click on add SSH key.

->There is one text box inside that text box we have to add our SSH key.

->Then we have to click on add key button.

So the new SSH key is generated and added So now it's ready to use.

Step2:Cloning
-------------

Git clone is primarily used to point to an existing repo and make a clone or copy of that repo at in a new directory, at another location. 

The original repository can be located on the local filesystem or on remote machine accessible supported protocols. 

The git clone command copies an existing Git repository.
     
Cloning a repository syncs it to your local machine. After you clone, you can add and edit files and then push and pull updates. 

This shows the diagramatic representation for how to clone the remote repository:

.. image:: https://static.javatpoint.com/tutorial/git/images/git-clone.png
   :width: 400
   :height: 300
   :align: center
   
We have to use below command for cloning the remote repository to our local file system 

                            
.. code-block:: C
   :caption: **command**
    
      $ git clone git@192.168.21.25:Experiment/myproject.git


.. code-block:: C
   :caption: **output**
    
      $Cloning into 'myproject'...
       The authenticity of host '192.168.21.25 (192.168.21.25)' can't be established.
        ED25519 key fingerprint is SHA256:h78E5hPg/AP1e8adHL2rtQyo4eh9Ei/zX3nfdG4iAxQ.
        This key is not known by any other names
        Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
        Warning: Permanently added '192.168.21.25' (ED25519) to the list of known hosts.
        remote: Counting objects: 24, done.
        remote: Compressing objects: 100% (8/8), done.
        remote: Total 24 (delta 1), reused 0 (delta 0)
        Receiving objects: 100% (24/24), done.
        Resolving deltas: 100% (1/1), done.
                   
Now remote repository is cloned to our local system so now we can add and edit files and then push and pull updates.  

Step3:Pull
----------

The term pull is used to receive data from Git. It fetches and merges changes from the remote server to your working directory. The git pull command is used to pull a repository.

The pull command is used to access the changes (commits)from a remote repository to the local repository. It updates the local branches with the remote-tracking branches. Remote tracking branches are branches that have been set up to push and pull from the remote repository. Generally, it is a collection of the fetch and merges command. First, it fetches the changes from remote and combined them with the local repository.

This shows the diagramatic representation of how pull works:

.. image:: https://static.javatpoint.com/tutorial/git/images/git-pull.png
   :width: 400
   :height: 300
   :align: center 
   
The syntax of the git pull command is given below:

.. code-block:: C
   :caption: **command**
    
      $ git pull
      
Pull, it's a single step process.

We have another option also that is fetch and merge, it's a two step process.

**Fetch and merge**

**Fetch**
Git "fetch" Downloads commits, objects and refs from another repository. It fetches branches and tags from one or more repositories. It holds repositories along with the objects that are necessary to complete their histories to keep updated remote-tracking branches. 

The "git fetch" command is used to pull the updates from remote-tracking branches. Additionally, we can get the updates that have been pushed to our remote branches to our local machines. As we know, a branch is a variation of our repositories main code, so the remote-tracking branches are branches that have been set up to pull and push from remote repository. 


Here is the command for fetching the document from remote repository:

.. code-block:: C
   :caption: **command**
    
      $ git fetch origin
      
      
.. code-block:: C
   :caption: **output**      
      
       remote: Counting objects: 40, done.
       remote: Compressing objects: 100% (14/14), done.
       remote: Total 32 (delta 1), reused 0 (delta 0)
       Unpacking objects: 100% (32/32), 2.72 KiB | 465.00 KiB/s, done.
       From 192.168.21.25:Experiment/myproject
       * [new branch]      Ranjitha            -> origin/Ranjitha
       * [new branch]      branched_experiment -> origin/branched_experiment
       * [new branch]      dhanya              -> origin/dhanya
       * [new branch]      lavanya             -> origin/lavanya
       * [new branch]      lowercase           -> origin/lowercase
       * [new branch]      prajwal             -> origin/prajwal
       * [new branch]      surekha             -> origin/surekha
       * [new branch]      uppercase           -> origin/uppercase
      
It will fetch all the data to local repository. Then we have to merge it by using merge.

**Merge**

In Git, the merging is a procedure to connect the forked history. It joins two or more development history together. The git merge command facilitates you to take the data created by git branch and integrate them into a single branch. Git merge will associate a series of commits into one unified history. Generally, git merge is used to combine two branches.

Here is the command for merging the document to remote repository:

.. code-block:: C
   :caption: **command**
    
      $ git merge 
      
It will merge the updated content.

Step4:Push
----------

The push term refers to upload local repository content to a remote repository. 

Pushing is an act of transfer commits from your local repository to a remote repository. 

Pushing is capable of overwriting changes; caution should be taken when pushing.  

Push updates the remote refs with local repository. 

Every time you push into the repository, it is updated with some interesting changes that you made. 

If we do not specify the location of a repository, then it will push to default location at origin master. 

This shows the diagramatic representation of how push works:

.. image:: https://static.javatpoint.com/tutorial/git/images/git-push.png
   :width: 400
   :height: 300
   :align: center    

Here is the command for pushing the document to remote repository:  

.. code-block:: C
   :caption: **command**
    
      $ git push --set-upstream origin Prajwal 
      
.. code-block:: C
   :caption: **output** 
   
     Enumerating objects: 8, done.
     Counting objects: 100% (8/8), done.
     Delta compression using up to 4 threads
     Compressing objects: 100% (3/3), done.
     Writing objects: 100% (6/6), 610 bytes | 610.00 KiB/s, done.
     Total 6 (delta 0), reused 0 (delta 0), pack-reused 0
     To 192.168.21.25:Experiment/myproject.git
     * [new branch]      Prajwal -> Prajwal
     Branch 'Prajwal' set up to track remote branch 'Prajwal' from 'origin'.  
     

After pushing the content to remote repository we can check whether our updated content is present in remote repository or not.

Now our file can be globally accessible because it is present in remote repository.

6.Miscellaneous commands:
-------------------------

1. **git commit --amend:**

The git commit --amend command is a convenient way to modify the most recent commit. 

It lets you combine staged changes with the previous commit instead of creating an entirely new commit. 

It can also be used to simply edit the previous commit message without changing its snapshot.

Here is the command for modifing the last commit: 

.. code-block:: C
   :caption: **command**
    
      $ git commit --amend
      
Then, it'll open the text editor so that we can update our commit message.

2. **git diff:**

How to check the difference between the two commits ?

We can check the difference between two commits by using git diff.

Here I'm showing how to check the difference between two commits:

.. code-block:: C
   :caption: **command**
    
      $ git diff 5e7d9ff 763fb04
      
Here I'm using two hash keys of two commits two check the difference between them. So here is the output of those.

.. code-block:: C
   :caption: **output**

    diff --git a/c_program/add.c b/c_program/add.c
   index 4d99f93..08e2d7b 100644
   --- a/c_program/add.c
    +++ b/c_program/add.c
   @@ -6,7 +6,6 @@
   /*please declare the functions here*/
   int sum(int, int);
   int sub(int, int);
   -int mod(int, int);
 
   int main() {
    int num1, num2, res;
   @@ -17,10 +16,9 @@ int main() {
    /*Call Function Sum With Two Parameters*/
    res = sum(num1, num2);
    res = sub(num1,num2);
   res = mod(num1,num2);
   printf("nAddition of two number is : ",res);
   printf("subtraction of two numbers is : ",res);
   printf("modulus of two numbers is : ",res);
   printf("nAddition of two number is : "&res);
   printf("subtraction of two numbers is : "&res);
    return (0);}
   int sum(int num1, int num2) {
   @@ -37,10 +35,3 @@ int sum(int num1, int num2) {
                return (num3);
        }
 
    /*function added by Ranjitha*/

     int mod(int num1,int num2)
     {
        int num3 = num1 % num2 ;
        return num3;
    }   
 
3. **git grep -ril:** 

Regular grep will search through all files matching the specified patterns. 

Git grep, on the other hand, has its preferences. It only searches files that Git knows about.  

-r(recursive) -> It searches in subdirectories.

-i(ignore-case) -> It searches by ignoring the case means case insensitive.

-l(file with matches) -> It shows only file names instead of matching lines.

Let's take one example, if we want to search or find the working directory for add().

Here is the solution to find the working directory for add() method.

.. code-block:: C
   :caption: **command**
    
      $ git grep -ril add
      
It will give search the working directory for add and display the name in output.

.. code-block:: C
   :caption: **output**
    
      c_program/add.c
      
4. **git blmae**:

Git blame provides more information about every line in a file, including the last modified time, author, and commit hash.

We can use git blame to find out who has done what changes in the specific file.

Here is the example of git blame command.

.. code-block:: C
   :caption: **command**
    
      $ git blame add.c
      
.. code-block:: C
   :caption: **output**
    
    2add9cc3 (Swathi Glaret     2023-07-29 13:24:41 +0530  1) /* File added by swathi*/
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530  2) #include<stdio.h>
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530  3) #include<conio.h>
    763fb043 (Saurava Mohapatra 2023-07-29 14:57:34 +0530  4) 
    763fb043 (Saurava Mohapatra 2023-07-29 14:57:34 +0530  5) /*Declarations of functions to avoid implicit declaration warning*/
    763fb043 (Saurava Mohapatra 2023-07-29 14:57:34 +0530  6) /*please declare the functions here*/
    763fb043 (Saurava Mohapatra 2023-07-29 14:57:34 +0530  7) int sum(int, int);
    763fb043 (Saurava Mohapatra 2023-07-29 14:57:34 +0530  8) int sub(int, int);
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530  9) int mod(int, int);
    763fb043 (Saurava Mohapatra 2023-07-29 14:57:34 +0530 10) 
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 11) int main() {
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 12)    int num1, num2, res;
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 13)  
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 14)    printf("\nEnter the two numbers : ");
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 15)    scanf("%d %d", &num1, &num2);
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 16)  
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 17)    /*Call Function Sum With Two Parameters*/
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 18)    res = sum(num1, num2);
    14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 19)    res = sub(num1,num2);
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 20)    res = mod(num1,num2);
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 21)    printf("nAddition of two number is : ",res);
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 22)    printf("subtraction of two numbers is : ",res);
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 23)    printf("modulus of two numbers is : ",res);
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 24)    return (0);
    14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 25)  }
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 26) int sum(int num1, int num2) {
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 27)    int num3;
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 28)    num3 = num1 + num2;
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 29)    return (num3);
    c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 30) }
    14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 31) /*function added by lavanya*/
    14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 32) 
    14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 33) 
    14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 34)       int sub(int num1, int num2)
    14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 35)       {       
   14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 36)               int num3=num1-num2; 
   14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 37)               return (num3);
   14a6fc84 (Lavanya P         2023-07-29 14:39:41 +0530 38)       }
   c6f6c09b (Swathi Glaret     2023-07-29 13:47:11 +0530 39) 
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 40) /*function added by Ranjitha*/
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 41) 
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 42)      int mod(int num1,int num2)
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 43)     {
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 44)         int num3 = num1 % num2 ;
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 45)         return num3;
    5e7d9fff (Ranjitha D        2023-07-29 16:14:46 +0530 46)     }  
    
    
It will display the output as who changed what and at what time they modifed with hash key. 


5. **git stash:** 

git stash temporarily shelves changes you've made to your working copy so you can work on something else, and then come back and re-apply them later on. 

Stashing is handy if you need to quickly switch context and work on something else, but you're mid-way through a code change and aren't quite ready to commit.

.. image:: https://static.javatpoint.com/tutorial/git/images/git-stash.png
   :width: 400
   :height: 300
   :align: center 
   
.. code-block:: C
   :caption: **command**
    
      $ git stash
      
.. code-block:: C
   :caption: **output**  
    
    No local changes to save
    
6. **git fsck:**

When we use git fsck, it will examines all the objects in the repository, such as commits, trees,blobs and annoted tags and perform various checks to ensure that the object are well formed and consistent.

git fsck command is mainly used for maintenance and trobleshooting purposes. when you run gitfsck git will displays any issues it finds, and you can take appropriate actions to address them if necessory

.. code-block:: C
   :caption: **command**
    
      $ git fsck
      
           
.. code-block:: C
   :caption: **output**  
   
   Checking object directories: 100% (256/256), done.
   Checking objects: 100% (158/158), done.    
   
7. **git bisect:**

The git bisect command is a powerful tool that quickly checks out a commit halfway between a known good state and a known bad state and then asks you to identify the commit as either good or bad.

Then it repeats until you find the exact commit where the code in question was first introduced. 

First we need to start the bisect.

.. code-block:: C
   :caption: **command**
    
      $ git bisect start
      
Now we can identify good and bad commits.
           
.. code-block:: C
   :caption: **command**  
   
    git bisect good 5e7d9ff  
    
.. code-block:: C
   :caption: **command**  
   
    git bisect bad 763fb04
    
 
.. code-block:: C
   :caption: **output**  
   
   763fb0432bd524c78029426694311ddebbe7bdda was both good and bad
   
We can reset our bisect by using below command.

.. code-block:: C
   :caption: **command**  
   
     git bisect reset
    
 
.. code-block:: C
   :caption: **output**  
   
     Already on 'c_program'
     Your branch is ahead of 'origin/c_program' by 1 commit. 

8. **git tag:**

Tags make a point as a specific point in Git history. Tags are used to mark a commit stage as relevant. We can tag a commit for future reference. Primarily, it is used to mark a project's initial point like v-1.0.

Tags are much like branches, and they do not change once initiated. We can have any number of tags on a branch or different branches. The below figure demonstrates the tags on various branches.  

We can add tag or create tag by using git tag which is just a pointer to a specific commit in the repository's history, Lightweight tags are simple and do not store additional metadata.

.. image:: https://static.javatpoint.com/tutorial/git/images/git-tags.png
   :width: 400
   :height: 300
   :align: center
   
To create the tag:

.. code-block:: C
   :caption: **command**  
   
      git tag -a v-1.0 -m"version 1.0 release"
      
It will create the tag in local repository then we can view the created tag by using the below command.

.. code-block:: C
   :caption: **command**  
   
      git tag
      
      
.. code-block:: C
   :caption: **output**  
   
    v-1.0
    
To delete the created tag from local repository we can use below command:

.. code-block:: C
   :caption: **command**  
   
      git tag -d v-1.0    
    
The tags which are created in local repository so we nedd to push this to remote repository.

.. code-block:: C
   :caption: **command**  
   
      git push origin --tags
      
To delete the created tag from remote repository we can use below command:

.. code-block:: C
   :caption: **command**  
   
      git push origin --delete v-1.0                    
