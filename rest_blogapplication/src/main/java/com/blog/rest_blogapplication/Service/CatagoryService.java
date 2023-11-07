package com.blog.rest_blogapplication.Service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.blog.rest_blogapplication.Model.Catagory;
import com.blog.rest_blogapplication.Payloads.CatagoryDto;
import com.blog.rest_blogapplication.Repository.CatagoryRepo;

@Service
@Component
public class CatagoryService implements CatagoryInterface{

    @Autowired
    CatagoryRepo catagoryRepo;

    @Autowired
    ModelMapper modelMapper;

    private int getMaxId()
    {
        return catagoryRepo.findAll().size()+1;
    }

    @Override
    public CatagoryDto createCatagory(CatagoryDto catagoryDto) 
    {
      catagoryDto.setId(getMaxId());
      Catagory newCatagory=modelMapper.map(catagoryDto, Catagory.class);
      catagoryRepo.save(newCatagory);
      return catagoryDto;
    }

    @Override
    public List<CatagoryDto> getAllCatagory() 
    {
    List <Catagory> catagory=catagoryRepo.findAll();
    List <CatagoryDto> dto=new ArrayList<>();
    for(Catagory c: catagory)
    {
        
    } 
    return dto; 
    }

    @Override
    public void daleteCatagory(CatagoryDto catagoryDto) 
    {
       
    }

    @Override
    public CatagoryDto getCatagoryById(int id) 
    {
      
    }

    @Override
    public CatagoryDto updateCatagory(CatagoryDto catagoryDto) 
    {
    Catagory newCatagory=modelMapper.map(catagoryDto, Catagory.class);
    catagoryRepo.save(newCatagory);
    return catagoryDto;
    }

    //Converting from CatagoryDto to Catagory
    public Catagory dtoToCatagory(CatagoryDto catagoryDto)
    {
    Catagory Cdto=this.modelMapper.map(catagoryDto, Catagory.class);
    return Cdto;
    }

    //Converting from Catagory to catagoryDto
    public CatagoryDto catagortTodto(Catagory catagory)
    {
        CatagoryDto dtoC=this.modelMapper.map(catagory,CatagoryDto.class );
        return dtoC;
    }
    
}
