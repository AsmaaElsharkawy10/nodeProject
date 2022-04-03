//Required modules
require('dotenv').config()
const express = require("express");
const body_parser=require("body-parser");
const mongoose=require("mongoose");
const morgan = require('morgan');
const multer = require("multer");
const path = require("path");

const authentication_router=require("./routers/authenticationRouter");
const student_router=require("./routers/studentRouter");
const speaker_router = require('./routers/speakerRouter')
const event_router = require('./routers/eventRouter');
const department_router = require("./routers/departmentRouter")

//image variables
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"images"))
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toLocaleDateString().replace(/\//g,"-")+"-"+file.originalname)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype=="image/jpeg"||file.mimetype=="image/jpg"||file.mimetype=="image/png")
       cb(null,true)
    else
        cb(null,false)
}


// open srever
const app = express();

mongoose.connect(process.env.DB_URL)
        .then(()=>{
            console.log("Connected to Database Successfully");
            // listen on port Number
            app.listen(process.env.PORT||process.env.Port_Number,()=>{
                console.log("I am Listenining ",process.env.Port_Number)
            });
        })
        .catch(error=>{
                console.log(" DB Problem")
        })


//Middlewares
//middleware to  request url and method
app.use(morgan("tiny"));
// we can get logs
app.get("/", (request, response) => {
response.send("Hello from request response mw");
//console.log(req.method, req.url)
});

//Middle ware for CORS.
app.use((request,response,next)=>{
    response.header("Access-Control-Allow-Origin","*");
    response.header("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,OPTIONS");
    response.header("Access-Control-Allow-Headers","Content-Type,Authorization")
    next();
})

//parse request
app.use("/images",express.static(path.join(__dirname,"images")));
app.use(multer({storage,fileFilter}).single("image"))
 app.use(body_parser.json());
 app.use(body_parser.urlencoded({extended:false}));
//////////////////////////////////// Routers (End points)
app.use(authentication_router)
app.use(student_router)
app.use(speaker_router)
app.use(event_router)
app.use(department_router)

//Not found middleware
app.use((request,response)=>{
    response.status(404).json({data:"Not found"})
})

// // //Error middleware
app.use((error,request,response,next)=>{
    let status = error.status||500;
    response.status(status).json({Error:error+""})
})





