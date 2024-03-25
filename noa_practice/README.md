# Resolving github issues from local repository to remote repository and key paring 

* To Start with if we want to do key paring form our local computer to git hub repository we will have to create one github 'Repository' in our github account.


![Alt text](Readme_Images/github1.jpg "github repository image")


* Later you will have to check the key paring whether already key exist or not with below command. 

``ls -al ~/.ssh
``
* If exist you will get the below files as response.


```

prajwal@prajwal-patil:~/git_Persnol/My_First_repository/noa_practice$ ls -al ~/.ssh
total 44
drwx------  2 prajwal prajwal 4096 Feb 19 16:01 .
drwxr-x--- 98 prajwal prajwal 4096 Mar 25 14:38 ..
-rw-rw-r--  1 prajwal prajwal  122 Feb  7 12:41 config
-rw-------  1 prajwal prajwal  399 Oct 16 17:36 id_ed25519
-rw-r--r--  1 prajwal prajwal   89 Oct 16 17:36 id_ed25519.pub
-rw-------  1 prajwal prajwal 2602 Jul 27  2023 id_rsa
-rw-r--r--  1 prajwal prajwal  569 Jul 27  2023 id_rsa.pub
-rw-------  1 root    root    5430 Feb 19 16:01 known_hosts
-rw-------  1 prajwal prajwal 5872 Feb 19 15:51 known_hosts.old

```
* Later you can delete and generate new one or you can copy existing one and paste. 

* By below given command you can remove these files.

```
rm id_ed25519 id_ed25519.pub

rm id_rsa id_rsa.pub

```

* Later after deleting you will have to generate the key by below given command.

```
ssh-keygen -t rsa -b 4096 -C "prajwalmp31@gmail.com"

```
* Then you will see this output.

```
prajwal@prajwal-patil:~$ ssh-keygen -t ed25519 -C "prajwalm31@gmail.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/prajwal/.ssh/id_ed25519): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/prajwal/.ssh/id_ed25519
Your public key has been saved in /home/prajwal/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:PKr4uqbwsBQTWAEeONerDVld0cK5dMe286twfLB0UtQ prajwalm31@gmail.com
The key's randomart image is:
+--[ED25519 256]--+
|oooo . oo+ .  .. |
|=.o o . = o +.  E|
|.= o . . + o ..  |
|  + .  ..   o.   |
| o +    S   +o.  |
|  + .  . . o =.  |
|o.    .   . + .. |
|o+.. .     o ..  |
|oo=+o       ..   |
+----[SHA256]-----+

```

* Later here everywhere you should give enter-enter-enter to get this.

* Now, Once you do this you will receive below files.

```
prajwal@prajwal-patil:~/.ssh$ ls -ltr
total 28
-rw-rw-r-- 1 prajwal prajwal  122 Feb  7 12:41 config
-rw------- 1 prajwal prajwal 5872 Feb 19 15:51 known_hosts.old
-rw------- 1 root    root    5430 Feb 19 16:01 known_hosts
-rw-r--r-- 1 prajwal prajwal  102 Mar 25 15:16 id_ed25519.pub
-rw------- 1 prajwal prajwal  464 Mar 25 15:16 id_ed25519
prajwal@prajwal-patil:~/.ssh$ cat id_ed25519.pub 

```

* Later enter into file and copy the key.

```
cat id_ed25519.pub
```
* Paste this key in the 

```
github ==> SSH and GPG keys ==> New SSH key 
```
* In this location paste the key and add the title.

* Next, you will have to add remote url to your local system, for that you wil have to generate access token below is the steps. 

```
Developer settings ==> Personal access tokens ==> Tokens ==> Generate new toke 
```
* After generating you will get page like below.


![Alt text](Readme_Images/github2.png "github repository image")

* Then, in your terminal clone the repository and pull all the branches and with below command do add remote repository.

* Example in between access token is added with repository url 
```
git remote set-url origin https://Prajwal-Patil31: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@github.com/Prajwal-Patil31/My_First_repository.git

```
* Syntax 

```
git remote set-url origin https://your_github_username:<your_personal_access_token>@github.com/Prajwal-Patil31/My_First_repository.git

```

* Then you can add the files, commit with below command.

```
git commit -m "Removed NOA_Practice folder"
```

* Then, push.

* If you find any error like this below '! [rejected] then it is header missmatch (conflict)

```
prajwal@prajwal-patil:~/git_Persnol/My_First_repository$ git push origin Development 
To https://github.com/Prajwal-Patil31/My_First_repository.git
 ! [rejected]        Development -> Development (fetch first)
error: failed to push some refs to 'https://github.com/Prajwal-Patil31/My_First_repository.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

```

* To resolve this you can follow below commands.

```
git fetch origin
```
* Then you will see this output.

```
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 9 (delta 1), reused 9 (delta 1), pack-reused 0
Unpacking objects: 100% (9/9), 1.33 KiB | 680.00 KiB/s, done.
From https://github.com/Prajwal-Patil31/My_First_repository
   8762e16..1456496  Development -> origin/Development
```

* Later merge the conflicts.

```
git merge origin/Development
```
* You will see this output.

* Now, you can push.

```
 git push origin Development
```

``
Note: If you delete something you should pull the branch and do checkout and add, commit and push.
``