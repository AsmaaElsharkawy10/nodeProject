const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bycrpt = require('mongoose-bcrypt');

// Build schema
const schema = new mongoose.Schema({
    _id:Number,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true, 
        match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, 'Please fill a valid email address like event@gamil.com']
    },
    password:{type:String , min:8 ,max:20,required:[true,"Enter your password"],bycrpt:true},
    fullName:{type:String,required:[true,"Enter your name"]},
    role:String
}, { _id: false} ) 
schema.plugin(AutoIncrement,{inc_field:"_id"});
schema.plugin(bycrpt);

//2- register schema in mongoose
module.exports=mongoose.model("students",schema);

