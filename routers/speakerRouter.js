const express = require('express');
const { body,query,param } = require('express-validator');

const router = express.Router();
const isAuth =  require('./../middleware/authMiddleware');
const controller = require("./../controllers/speakerController")


router.route("/speakers")
      .get(isAuth,controller.getAllSpeakers)
      .post(isAuth,[
            body("name").isAlpha().withMessage("Name should be string"),
            body("password").isString().withMessage("password should be chars and nums").isLength({min:8 , max:20}),
            body("email").isEmail().withMessage("email should be ....@.....com"),
            body("address").isObject().optional().withMessage("address should be object"),
            body("address.city").isAlpha().withMessage("City should be string"),
            body("address.street").isAlpha().withMessage("Street should be string"),
            body("address.building").isInt().withMessage("Building should be number"),
            body("image").trim().isString().withMessage("image should be string"),
            body("department").isString().withMessage("Enter your department")
        ],controller.createSpeaker)
      .put(isAuth,controller.updateSpeaker)
      .delete(isAuth,controller.deleteSpeaker)
 module.exports = router;