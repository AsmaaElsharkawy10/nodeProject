const {validationResult}=require("express-validator");
const Speaker = require("./../models/speakerSchema")
exports.getAllSpeakers=(request,response,next)=>{
if(request.role =="admin") {
    Speaker.find({}).populate({path:"department"})
            .then(data=>{response.status(200).json(data)})
            .catch(error=>{next(error)})
}
else{
    throw new Error("not admin")
}
}
//-------------------------------------------------------

exports.createSpeaker=(request,response,next)=>{

    let errors= validationResult(request);
    if(!errors.isEmpty())
    {
           let error=new Error();
           error.status=422;
           error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
           throw error;
    }
    if(request.role =="speaker")
    {
    let object = new Speaker({
        email: request.body.email,
        password: request.body.password,
        fullName:request.body.name,
        role:'speaker',
        // image:request.file.filename,
        address:request.body.address,
        department:request.body.department
    })
    object.save()
    .then(data=>{
        response.status(201).json({message:"Speaker added",data})
    })
    .catch(error=>next(error))
}else{
    throw new Error("not Speaker")
}
}

//update speaker
 exports.updateSpeaker=(request,response,next)=>{
    if(request.role =="speaker"){
Speaker.findOne({email:request.email})
       .then(data=>{
                  if(data===null) throw new Error ("speaker Not found")
                  data.email = request.body.email
                  data.password = request.body.password
                  data.fullName=request.body.name
                  data.role=request.body.role
                 // data.image=request.file.filename
                  data.address=request.body.address
                  data.department=request.body.department

                  return data.save()
              })
              .then(data=>{
                    //response
                    if(data==null) throw new Error("Department Is not Found!")
                    response.status(200).json({message:"updated",data})
                   
              })
              .catch(error=>next(error))
}else{    
    throw new Error("not Speaker")
}
 }


//Delete speaker
exports.deleteSpeaker=(request,response,next)=>{
     if(request.role =="speaker") {
        Speaker.remove({email:request.email})
                  .then(data=>{
                      if(data==null) throw new Error("Department Is not Found!")
                      response.status(200).json({data,message:"speaker deleted"})
                  })
                  .catch(error=>next(error))
}else{   
     throw new Error("not admin")
}
}

