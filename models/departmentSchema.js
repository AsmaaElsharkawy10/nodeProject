const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);


// Build schema
const schema = new mongoose.Schema({
    _id:{type:Number,alias:"department_id"},
    name:{type:String , unique:true}
}) 

//2- register schema in 
schema.plugin(AutoIncrement, { inc_field: "department_id" });
module.exports=mongoose.model("departments",schema);

