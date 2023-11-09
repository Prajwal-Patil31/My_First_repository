package com.blog.rest_blogapplication.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.blog.rest_blogapplication.Payloads.CatagoryDto;
import com.blog.rest_blogapplication.Service.CatagoryService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
public class CatagoryController 
{
@Autowired
CatagoryService catagoryService;    
    
@RequestMapping(path = "/catagory",method = RequestMethod.POST)
public ResponseEntity<CatagoryDto> createCatagory(@RequestBody CatagoryDto catagoryDto)
{
try
{
catagoryDto=catagoryService.createCatagory(catagoryDto);
System.out.println( "New catagory created"+" "+catagoryDto);
return new ResponseEntity<>(catagoryDto,HttpStatus.CREATED);
}
catch(Exception e)
{
return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
}
}

@RequestMapping(path = "/catall",method = RequestMethod.GET)
public ResponseEntity<List<CatagoryDto>> getAll()
{
    try
    {
    List<CatagoryDto> getall= catagoryService.getAllCatagory();
    System.out.println("Got all catagory"+" "+getall);
    return new ResponseEntity<List<CatagoryDto>>(getall,HttpStatus.FOUND);
    }
    catch(Exception e)
    {
    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

@RequestMapping(path = "/catagory/{id}",method = RequestMethod.GET)
public ResponseEntity<CatagoryDto> getbyid(@PathVariable (value = "id") int id)
{
    try
    {
        CatagoryDto getId= catagoryService.getCatagoryById(id);
        System.out.println("Found catagory by id"+" "+getId);
        return new ResponseEntity<CatagoryDto>(getId,HttpStatus.OK);
    }
    catch (Exception e)
    {
        return new ResponseEntity<>(HttpStatus.FOUND);
    }
}

@RequestMapping(path = "/catagory/{id}",method = RequestMethod.PUT)
public ResponseEntity<CatagoryDto> update(@PathVariable (value = "id") int id ,@RequestBody CatagoryDto catagoryDto)
{
    try
    {
    CatagoryDto existingcatagory=catagoryService.getCatagoryById(id);
    if(catagoryDto.getDescription() !=null && !catagoryDto.getDescription().isEmpty())
    {
     existingcatagory.setDescription(catagoryDto.getDescription());
    }
    if(catagoryDto.getTitle() !=null && !catagoryDto.getTitle().isEmpty())
    {
        existingcatagory.setTitle(catagoryDto.getTitle());
    }
    CatagoryDto updatedCatagory =catagoryService.updateCatagory(existingcatagory);
    return new ResponseEntity<CatagoryDto>(updatedCatagory,HttpStatus.OK);
    }
    catch(Exception e)
    {
    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
}

}
