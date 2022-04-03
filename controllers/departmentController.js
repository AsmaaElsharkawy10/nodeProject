const {validationResult}=require("express-validator");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const Department = require("./../models/departmentSchema")

exports.getAllDepartments=(request,response,next)=>{
if(request.role == "admin"){
    Department.find({})
              .then(data=>{response.status(200).json(data)})
              .catch(error=>{next(error)})
}else{throw new Error ("Not Admin")} 
}
exports.createDepartment=(request,response,next)=>{
    let errors=   validationResult(request);
    if(!errors.isEmpty())
    {
           let error=new Error();
           error.status=422;
           error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
           throw error;
    }
  if(request.role == "admin"){
    let object = new Department({
        name: request.body.name,
    })
    object.save()
          .then(data=>{
                 response.status(201).json({message:"Department added",data})
                })
    .catch(error=>next(error))
            }
    else{throw new Error ("Not Admin")}
}
 
