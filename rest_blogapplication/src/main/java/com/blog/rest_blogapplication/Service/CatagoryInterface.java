package com.blog.rest_blogapplication.Service;

import java.util.List;

import com.blog.rest_blogapplication.Payloads.CatagoryDto;

public interface CatagoryInterface 
{

    public CatagoryDto createCatagory(CatagoryDto catagoryDto);

    public List<CatagoryDto> getAllCatagory();

    public void daleteCatagory(CatagoryDto catagoryDto);

    public CatagoryDto getCatagoryById(int id);
    
    public CatagoryDto updateCatagory(CatagoryDto catagoryDto);
   

}
