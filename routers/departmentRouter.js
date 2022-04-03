const express = require('express');
const {body,query,param}=require("express-validator")
const router = express.Router();
const dep_controller = require("./../controllers/departmentController")
const isAuth =  require('./../middleware/authMiddleware');

router.route("/department")
      .get(isAuth,dep_controller.getAllDepartments)
      .post(isAuth,[
            body("name").isString().withMessage("Enter Department name"),
      ],dep_controller.createDepartment)
 module.exports = router;