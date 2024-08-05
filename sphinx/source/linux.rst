Linux commands
==============
Contents:

1. Directory commands
2. File commands
3. File content commands
4. Filter commands
5. Help commands
6. Miscellaneous commands
7. Network commands
8. Shell commands
9. Tool commands
10. User commands
11. Utility commands

1. Directory Commands
---------------------
`pwd:`
It will display the current directory.

Syntax: pwd

`mkdir:` 
It will creates the new directory.

Syntax: mkdir dir_name

`rmdir:`
It will removes the specified directory.

Syntax: rmdir dir_name

`cd:`
It is used to change the directory.

Syntax: cd dir_name

`ls:`
It will display the list of contents or files of a directory.

Syntax: ls 

With ls commands we can use options also, some of them are:

`a) ls -l:`
It will display the information about the files and contents of directory in long list format.

Syntax: ls -l

`b) ls -li:`
This command is used to print the index number if files is in the first column.

Syntax: ls -li

`c) ls -r:`
It is used to print the list in reverse order.

Syntax: ls -r

`d) ls -lh:`
It shows the result size in human uderstable format.

Syntax: ls -lh

`e) ls -R:`
It will shows the contents of subdirectories also.

Syntax: ls -R

`f) ls -n:`
It is used to print the groupid and userid.

Syntax: ls -n

`g) ls -lX:`
It will group the  files with same extensions together in list.

Syntax:  ls -lX

`h) ls ../:`
It will give the contents of the parent directory.

Syntax: ls ../

































2. File commands
----------------
`touch:`
It is used to create empty file.

Syntax: touch file_name

`cat:`
It is used to create a file,display content of the file, copy the content of one file to another file and more.

Syntax: cat file_name

Using cat we can do so many operations, some of them are:

`a) cat -n:`
If we want to display the content precending with line number we have to use -n option with  cat command.

Syntax: cat -n file_name

`b) cat file1 file2:`
At a time we can use two files using cat command.

Syntax: cat file1_name file2_name

`c) cat -E:`
using cat command we can highlight the end of the line.

Syntax: cat -E file_name

`d) cat >> :`
we can write a content inside the excisting file using cat command.

Syntax: cat >> file_name

`rm:`
By using this we can remove the specified file.

Syntax: rm file_name

`cp:`
It is used to copy the file or directory.

Syntax: cp ex_file new_file

`mv:`
It will move file or directory from one location to another.

Syntax: mv file1_name file2_name  



3. File content commands
------------------------
`head:`
It will displays the first 10 lines of the file.

Syntax: head file_name

`tail:`
It will displays the last 10 lines of the file.

Syntax: tail file_name

`tac:`
It works reverse as cat command,it will displays the file content in reverse order(last to first).

Syntax: tac file_name

`more:`
The more command is quite similar to cat command, as it is used to display the file content in the same way the cat command does. The only difference b/w both command is that, in case of larger file, the more command displays screenful output at a time . In more command, the following keys are used to scroll the page: enter key - To scroll down page by line. space bar - To move to the next page. b key - To move to the previous page. / key - To search the starting.

Syntax: more file_name

`less:`
Less command is similar to the more command. It also includes some extra features such as adjustment in width and height of the terminal, comparatively, the more command cuts the output in the width of the terminal.

Syntax: less file_name

`which:`
It is basically used to find the executed file associated with the command.

Syntax: which command











4. Filter commands
------------------

`cut:`
Used to select specific column of a file along with this command we have to use '-d ' and '-f ' options.

Syntax: cut  - d - -f2  file_name

`grep:`
Used to search content from a file. Generaly it is used with pipe operator.

Syntax: cat file_name | grep ‘character’

`comm:`
It is used to compare the two files.

Syntax: comm file1_name file2_name

`tr:`
Used to translate the file content like from uppercase to lowercase.

Syntax: Cat file_name | tr ‘old’  ‘new’

`uniq:`
It displays the words only once. It doesn't displays the duplicate words.

Syntax: sort file_name | uniq

`od:`
It is used  to display the content of the file in different style such as hexadecimal,octal and ASCII.

`a) od -b:` 
It will convert to octal format.

Syntax: od -b file_name

`b) od -t x1:`
It will convert to hexadecimal format.

Syntax: od -t x1 file_name

`c) od -c:`
It will convert to ASCII character format.

Syntax: od -c file_name

`wc:`
Counts line, words and characters in a file.

Syntax: wc file_name



`sort:`
Used to sort files in alphabetical order.

Syntax: sort file_name

`gzip:`
It is used to compress the file. It will replace the original file by compressed file and compressed file save with ‘.gz’ extension.

Syntax: gzip file_name

`gunzip:`
It is used to decompress the file. It works reverse of gzip command.

Syntax: gunzip file_name

`tee:`
The tee command is quite similar to the cat command. The only difference b/w both filters is that it puts standard i/p on standard o/p and also write them into a file.

Syntax: cat file_name | tee new_file

`sed:`
It is also known as stream editor. It is used to edit files using a regular expression. It doesn't permanently edit files, instead content remains only on display . It doesn't affect the actual file.

Syntax: command | sed ‘s/oldword/newword/’

`diff:`
It compares two files line by line and after comparing them, it will displays the parts that do not match.

Syntax: diff file1 file2














5. Help commands
----------------
`man:`
It displays the user manual of any command.
`a) man -selection_num:`
This option is used to display only a specific section of a manual.

Syntax: man -selection_num command

`b) man -a:`
Display all the available manual pages in succession.

Syntax: man -a command

`c) man -w:`
This option return the location in which the manual page of given command is present.

Syntax: man -w command

`info:`
It gives detailed information of commands.

Syntax: info command

`--h or --help:`
Provides information about in-built commands.

Syntax: --help command




















6. Miscellaneous commands
-------------------------
`echo:`
It is used to insert or print information.

Syntax: echo name

`nano:`
To create and open a new file by using text editor.

Syntax: nano file_name

`uname:`
It will displays the detailed information about the linux software and hardware. It includes machine name, operating system, kernel.

Syntax: uname

`options:`
-a: Prints all the system information.
-s: Prints the kernel name.
-n: Prints the system’s node hostname.

`who:`
Let's you to display the users currently logged in to your linux OS.

Syntax: who
























7. Network commands
-------------------
`hostname:`
To know the system's hostname.

Syntax: hostname

`ping:`
Ping command  pings a specific network host, on the local network on the internet.

Syntax: ping google.com

`ip:`
It displays the ip address.

Syntax: ip

































8. Shell command
----------------
`history:`
It will listout up to 500 previously executed commands.

Syntax: history

option: -c: It will clear all the history.

`alias:`
Alias command replace one string from another string and aliases are only available until you exit the shell.

Syntax: alias alias_name = “command”

`unalias:`
we can remove an alias by using unalias.

Syntax: unalias alias_name































9. tool command
---------------
`locate:`
Used to search a file by file_name.

Syntax: locate file_name









































10.User Commands
----------------
`id:`
id command is used to display the userid or groupid.

Syntax: id

`useradd:`
It is used to add user.

Syntax: useradd user_name

`userdel:`
To delete a user account we use userdel command.

Syntax: userdel user_del.

`passwd:`
used to create and change the password for a user.

Syntax: passwd 

`groupadd:`
used to create to user group.

Syntax: groupadd group_name

`su:`
This command provides administrative access to other user. In other words, it allows acess of the linux shell to another user.

Syntax: su user_name




















11. Utility Command
-------------------
`date:`
used to display the date,time,timezone

Syntax: date

`cal:`
It will displays the current month calendar

Syntax: cal

`time:`
It displays the time to execute a command

Syntax: time

`exit:`
used to exit from the current shell

Syntax: exit

`clear:`
clear the terminal sreen

Syntax: clear

`sleep:`
It holds the terminals by specified time

Syntax: sleep 4

`zcat:`
It is used to display the content of the compressed file

Syntax: zcat filename

`find:`
It is used for finding perticular file within a directory

Syntax: find file_name

`df:`
The df command is used to display the disk space used to display the disk space used in the file system.
It displays the output as in the number of used blocks, available blocks and the mounted directory

Syntax: df












