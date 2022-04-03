const {validationResult}=require("express-validator");
const Student = require("./../models/studentSchema")
const authMw = require("./../middleware/authMiddleware");
const req = require("express/lib/request");
exports.getAllStudents=(request,response,next)=>{
 if(request.role =="admin") 
 {
    Student.find({})
    .then(data=>{response.status(200).json(data)})
    .catch(error=>{next(error)})
 }else
 {
     throw new Error("notadmin")
 }
   
}

exports.createStudent=(request,response,next)=>{
    let errors=   validationResult(request);
    if(!errors.isEmpty())
    {
           let error=new Error();
           error.status=422;
           error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
           throw error;
    }
    if(request.role =="student")
    {
    let object = new Student({
        email: request.body.email,
        password: request.body.password,
        fullName:request.body.name,
        role:"student"
    })
    object.save()
    .then(data=>{
        response.status(201).json({message:"Student added",data})
    })
    .catch(error=>next(error))
}
  else
  {
      throw new Error("you are not student")
  }
}
exports.updateStudent=(request,response,next)=>{
    if(request.role =="student"){
        Student.findByIdAndUpdate(request._id,{
            $set:{
                email:request.body.email,
                password:request.body.password,
                fullName:request.body.name
            }
        })
                  .then(data=>{
                      if(data==null) throw new Error("Student Is not Found!")
                    response.status(200).json({message:"Student updated",data})
    
                  })
                  .catch(error=>next(error))
                }else{ throw new Error("you are not student can't update")}
    }

exports.deleteStudent=(request,response,next)=>{
    if(request.role =="student") 
{
        Student.findByIdAndDelete(request._id)
                  .then(data=>{
                      if(data==null) throw new Error("Student Is not Found!")
                      response.status(200).json({message:"student deleted"})
                  })
                  .catch(error=>next(error))
    }else{throw new Error("notadmin")}
 }

