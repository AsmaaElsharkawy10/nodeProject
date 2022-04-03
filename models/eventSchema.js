const mongoose = require("mongoose");
//const autoIncrement = require('mongoose-sequence')(mongoose);

// Build schema
const schema = new mongoose.Schema({
   // _id:Number,
    title:{type:String ,unique:true, required:true},
    date:{type:Date,required:true},
    mainSpeaker:{type:mongoose.Schema.Types.ObjectId,ref:"speakers",required:true},
    speakers:[{type:mongoose.Schema.Types.ObjectId,ref:"speakers"}],
    students:[{type:Number,ref:"students",required:true}],
}) 
//schema.plugin(autoIncremen);
//2- register schema in mongoose
module.exports=mongoose.model("events",schema);