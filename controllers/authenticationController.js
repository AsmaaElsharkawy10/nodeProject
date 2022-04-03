const {validationResult}=require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const speaker_schema = require("./../models/speakerSchema");
const student_schema = require("./../models/studentSchema");


//login
exports.login=(request,response,next)=>{
    let errors =  validationResult(request);
    if(!errors.isEmpty())
    {
           let error=new Error();
           error.status=422;
           error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
           throw error;
    }
    speaker_schema.findOne({email:request.body.email})
                  .then(data=>{
                     if(data===null){

                            student_schema.findOne({email:request.body.email})
                            .then(data=>{
                            if(data===null) next(new Error ("user Not found"))
                            checkUser(student_schema,request,response,next)
       })
                     }else{ checkUser(speaker_schema,request,response,next)
                     }
                })
               .catch(error=>next(error))
           
}

exports.changePassword=(request,response,next)=>{
       student_schema.findOneAndUpdate({'email':request.body.email},{$set:{'password':request.body.newPassword}})
                     .then(data=>{
                            if(data===null)  {
                                   speaker_schema.findOneAndUpdate({'email':request.body.email},{$set:{'password':request.body.newPassword}})
                                                 .then(data=>{
                                                        if(data===null) next(new Error ("user Not found"))
                                                        else{
                                                        response.status(201).json({message:"Speaker password updated",data})
                                                        }
                                                 })
                            }else{
                                   response.status(201).json({message:"Student password updated",data})   
                            }
                     
                     }).catch(error=>next(error))
}

exports.register=(request,response,next)=>{
       let errors =  validationResult(request);
       if(!errors.isEmpty())
       {
              let error=new Error();
              error.status=422;
              error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
              throw error;
       }
      response.status(201).json({data:"registered", BODY:request.body})
   }
   
//check if user registered or not and generate token
async function checkUser(model,request,response,next)
{
              try{
                     const data = await model.findOne({email:request.body.email})
                     if(data==null) throw new Error("user is not found")
                     else{ 
                            const matchPassword = await bcrypt.compare(request.body.password,data.password)
                             if(matchPassword){
                                    if(model == student_schema)
                                    {
                                          let token=jwt.sign({
                                                 _id:data._id,
                                                 role:data.role
                                   },process.env.secret_Key,{expiresIn:"1h"})
                                    response.status(200).json({data,token,message:"student logged successfully"})

                                    }
                                    else if(model == speaker_schema && data.role=="speaker")
                                    {
                                          let token=jwt.sign({
                                                 email:data.email,
                                                 role:data.role
                                   },process.env.secret_Key,{expiresIn:"1h"})
                               
                                    response.status(200).json({data,token,message:"speaker logged  successfully"})
                                    } else if(model == speaker_schema && data.role =="admin")
                                    {
                                          let token=jwt.sign({
                                                 email:data.email,
                                                 role:data.role
                                   },process.env.secret_Key,{expiresIn:"1h"})
                               
                                    response.status(200).json({data,token,message:"Admin logged  successfully"})  
                                    }
                             }
                             else{throw new Error("password is wrong") }  
                         }  
                     }
                 catch(error){ next(error)}
}
       