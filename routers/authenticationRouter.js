 const express = require("express");
 const {body,query,param } = require('express-validator');
const req = require("express/lib/request");
 const mongoose = require("mongoose");
 const router = express.Router();
 const authenticationController = require("../controllers/authenticationController");
 const speaker_controller = require("./../controllers/speakerController");
 const student_controller = require("./../controllers/studentController");
 

//login router
router.route("/login")
      .post([
        body("email").notEmpty().withMessage("Enter Email"),
        body("password").notEmpty().withMessage("Enter name")
],authenticationController.login)

//register router
router.post("/register",[
    body("name").isAlpha().isLength({min:3 , max:30}).withMessage("Name should be string"),
    body("password").isString().isLength({min:8 , max:20}).withMessage("password should be chars"),
    body("confirmPassword").isString().custom((value,{req})=>{
        console.log(req.body.password)
        if(value !== req.body.password ){
            throw new Error("paswword confirm not match");
        }else{ return true}
    }),
    body("email").isEmail().withMessage("email should be ....@.....com"),
    body("address").optional().isObject().withMessage("address should be object"),
    body("address.city").optional().isAlpha().withMessage("City should be string"),
    body("address.street").optional().isAlpha().withMessage("Street should be string"),
    body("address.building").optional().isInt().withMessage("Building should be number"),
    body("image").optional().trim().isString().withMessage("image should be string"),
    body("department").isString().optional().withMessage("Enter your department"),
    body("Role").isAlpha().withMessage("Enter a Role"),
    
],checkRole)

//change password router
router.put("/changePassword",[
    body("email").isAlpha().withMessage("Enter your email"),
    body("newPassword").notEmpty().isString().isLength({min:8 , max:20}).withMessage("Enter newpassword"),
    body("confirmPassword").notEmpty().isString().custom((value,{req})=>{
        console.log(req.body.password)
        if(value !== req.body.password ){
            throw new Error("paswword confirm not match");
        }else{ return true}
    })],authenticationController.changePassword);

//check speaker or student to register
function checkRole(request,response,next)
{
    if(request.body.Role == "speaker")
    {
        
        speaker_controller.createSpeaker(request,response,next);
    }else
    {
        student_controller.createStudent(request,response,next);
    }
}

 module.exports=router;