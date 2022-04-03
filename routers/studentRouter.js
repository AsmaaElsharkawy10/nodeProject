const express = require('express');
const { body,query,param } = require('express-validator');

const router = express.Router();
const jwt=require("jsonwebtoken");
const controller = require("./../controllers/studentController")
const isAuth =  require('./../middleware/authMiddleware');



router.route("/students")
      .get(isAuth,controller.getAllStudents)
      .post(isAuth,[
            body("name").isAlpha().withMessage("Name should be string"),
            body("password").isAlpha().withMessage("password should be chars").isLength({min:8 , max:20}),
            body("email").isEmail().withMessage("email should be ....@.....com")
        ],controller.createStudent)
      .put(isAuth,controller.updateStudent)
      .delete(isAuth,controller.deleteStudent)
 module.exports = router;