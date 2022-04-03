const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bycrpt = require('mongoose-bcrypt');
// Build schema
const schema = new mongoose.Schema({
    _id:{type:Number,alias:"speaker_id"},
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true, 
        match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, 'Please fill a valid email address like event@gamil.com']
    },
    role:{type:String, enum: ['speaker','admin']},
    password:{type:String , min:8 ,max:20,required:true,bycrpt:true},
    fullName:{type:String,required:true},
    image:String,
    address:{type:[{city:{type:String},street:{type:String},building:{type:Number}}]},
    department:{type:mongoose.Schema.Types.ObjectId,ref:"departments",required:true}
}) 
schema.plugin(AutoIncrement, { inc_field: "speaker_id" });
schema.plugin(bycrpt);
//2- register schema in mongoose
module.exports=mongoose.model("speakers",schema);
