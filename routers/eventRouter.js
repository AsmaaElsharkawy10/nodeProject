const express = require('express');
const {body,query,param}=require("express-validator")
const router = express.Router();
const isAuth =  require('./../middleware/authMiddleware');
const controller = require("../controllers/eventController")


router.route("/events")
      .get(isAuth,controller.getAllEvents)
      .post(isAuth,[
            body("title").isAlpha().withMessage("Enter title as a string"),
            body("eventDate").isDate().withMessage("Enter date"),
            body("mainSpeaker").isString().withMessage("Enter main Speaker"),
            body("speakers").isArray().withMessage("Enter other speakers"),
            body("students").isArray().withMessage("Enter students"),
      ],controller.createEventt)
      .put(isAuth,controller.updateEvent) 
      .delete(isAuth,controller.deleteEvent)
 module.exports = router;