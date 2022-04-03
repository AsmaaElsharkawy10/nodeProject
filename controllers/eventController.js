const {validationResult}=require("express-validator");
const Event = require('./../models/eventSchema');

exports.getAllEvents=(request,response,next)=>{
    if(request.role =="admin") {
    Event.find({}).populate({path:"students"})
    .then(data=>{response.status(200).json(data)})
    .catch(error=>{next(error)})
}else
{
    throw new Error("not admin")
}
}


exports.createEventt=(request,response,next)=>{
    let errors=   validationResult(request);
    if(!errors.isEmpty())
    {
           let error=new Error();
           error.status=422;
           error.message=errors.array().reduce((current,object)=>current+object.msg+" ","")
           throw error;
    }
    if(request.role =="admin") {
    let object = new Event({
        title: request.body.title,
        date: request.body.eventDate,
        mainSpeaker: request.body.mainSpeaker,
        speakers: request.body.speakers,
        students: request.body.students,
       
    })
    object.save()
    .then(data=>{
        response.status(201).json({message:"Event added",data})
    })
    .catch(error=>next(error))
}else
{
    throw new Error("not admin")
}
}

exports.updateEvent=(request,response,next)=>{
    if(request.role =="admin") {
        Event.findByIdAndUpdate(request.body._id,{
        $set:{
        title: request.body.title,
        date: request.body.eventDate,
        mainSpeaker: request.body.mainSpeaker,
        speakers: request.body.speakers,
        students: request.body.students,
        }
    })
              .then(data=>{
                  if(data==null) throw new Error("Event Is not Found!")
                response.status(200).json({message:"Event updated",data})

              })
              .catch(error=>next(error))
            }else
            {
                throw new Error("not admin")
            }
        }
exports.deleteEvent=(request,response)=>{
    if(request.role =="admin") {
    Event.findByIdAndDelete(request.body._id)
    .then(data=>{
        if(data==null) throw new Error("event Is not Found!")
        response.status(200).json({message:"event deleted"})
    })
    .catch(error=>next(error))
}else{
 throw new Error("not admin")
}
}