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
    dto.add(catagortTodto(c));
    } 
    return dto; 
    }

    @Override
    public void daleteCatagory(CatagoryDto catagoryDto) 
    {
    Catagory newCatagory=modelMapper.map(catagoryDto, Catagory.class);
    catagoryRepo.delete(newCatagory);
    }

    @Override
    public CatagoryDto getCatagoryById(int id) 
    {
    List<Catagory> catagorie=catagoryRepo.findAll();
    Catagory cat=null;
    for (Catagory c: catagorie)
    {
    if(c.getId()==id)
    {
    cat=c;
    }
    }
    return catagortTodto(cat);
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
    Catagory catagory=this.modelMapper.map(catagoryDto, Catagory.class);
    return catagory;
    }

    //Converting from Catagory to catagoryDto
    public CatagoryDto catagortTodto(Catagory catagory)
    {
    CatagoryDto catdto=this.modelMapper.map(catagory,CatagoryDto.class );
    return catdto;
    }
    
}
