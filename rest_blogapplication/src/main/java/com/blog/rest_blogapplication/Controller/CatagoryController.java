package com.blog.rest_blogapplication.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
return new ResponseEntity<>(catagoryDto,HttpStatus.CREATED);
}
catch(Exception e)
{
return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
}
}
}
