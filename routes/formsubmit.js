const router = require("express").Router();
const Form = require("../models/Form");
const moment = require("moment");
const verifyToken = require("../controllers/middleware");
// const nodemailer = require("nodemailer");

// to post form data in db
router.post("/", verifyToken, async (req, res) => {
  try {
    // console.log(req.body);
    const formExists = await Form.findOne({ email: req.body.email });

    // console.log(req.body.content);
    if (formExists) {
      let time = moment().format("hh mm ss a");
      // time validation
      // let time = "05 40 00 pm";
      time = time.split(" ");
      hh = parseInt(time[0]);
      mm = parseInt(time[1]);
      ss = parseInt(time[2]);
      day = time[3];
      if (hh >= 05 && hh < 06) {
        if (mm >= 30 && mm <= 59) {
          if ((ss >= 00 && ss <= 59) || ss === 00) {
            if (day === "pm") {
              newContent = await Form.findOneAndUpdate(
                { email: req.body.email },
                {
                  $push: { content: req.body.content },
                },
                { new: true }
              );
              res.status(200).json({
                message: "Form Submitted Successfully",
                data: newContent,
              });
            }
          }
        }
      } else {
        res.status(400).json({
          message: "Error!! You can only submit form between 5:30pm and 6pm",
        });
      }
    } else {
      res.status(400).json({ message: "Form doesnot exist" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
