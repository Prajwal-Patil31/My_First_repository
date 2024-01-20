# <========== Written steps that i had followed to run this project ==========>
* I had built it in java 1.8 version, so to run this you need to have java jdk.1.8 or higher version.
* In spring boot application i had changed version in pom file that is 
Earlier it was 

|		<version>3.1.8</version>       |
	                                        
                                                                  
Later i had changed it to 

|    <version>2.3.4.RELEASE</version> |

this i had done because now you won't get spring boot project that can be built on jdk 1.8 version so if you do these changes you can run spring boot project on java8 and also you need to change java version from 17 to 1.8.
* To change the jar file name add 

|finalName></finalName> |

tag outside of plugins.


