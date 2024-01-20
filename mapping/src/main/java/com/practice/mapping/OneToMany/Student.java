package com.practice.mapping.OneToMany;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "jpa_student")
public class Student 
{
    @Id
    private int studentId;
    private String studentName;
    private String about;


                              
                                                    //Situation one student has only one laptop and one laptop will be related to one student only So, we will make one reference variable 
@OneToOne(mappedBy = "student")                      //By this we will inform database that we are making one to one mapping   
private Laptops laptop;                              //Now in this table we will get one foreign key in this laptops column
                                                    //- will be foreign key. Now whenever you create student that students laptops id will be stored in this column.
                                                   //This type of mapping is called as unidirection if we get student we can fetch his laptops. 
                                                   //But if we get laptop then we cannot get that which students it is.So, to make it bidirectional we will declare student object in laptop class.
                                                   //We are using this mapped by function to avoide creaing the multiple foreign key column in tables. Now only one foreign key table will be created in laptop column.


    public int getStudentId() {
        return studentId;
    }
    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }
    public String getStudentName() {
        return studentName;
    }
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    public String getAbout() {
        return about;
    }
    public void setAbout(String about) {
        this.about = about;
    }
    public Student(int studentId, String studentName, String about, Laptops laptop) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.about = about;
        this.laptop = laptop;
    }
    @Override
    public String toString() {
        return "Student [studentId=" + studentId + ", studentName=" + studentName + ", about=" + about + ", laptop="
                + laptop + "]";
    }
   public Student() {
    super();
   }
public void setLaptop(Laptops laptop) {
    this.laptop = laptop;
}
public Laptops getLaptop() {
    return laptop;
}
}
