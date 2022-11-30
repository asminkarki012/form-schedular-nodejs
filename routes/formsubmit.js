const router = require("express").Router();
const Form = require("../models/Form");
const moment = require("moment");
// const nodemailer = require("nodemailer");

// to post form data in db
router.post("/", async (req, res) => {
  try {
    const formExists = await Form.findOne({ email: req.body.email });
    if (!formExists) {
      console.log(req.body);
      console.log(req.body.email);
      const newForm = new Form(req.body);
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
              await newForm.save();
              res.status(200).json({
                message: "Form Submitted Successfully",
                data: newForm,
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
      res.status(400).json({ message: "Form Already exists" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//setting up cron-node to get data from db and sending data to the email
// router.get("/", async (req, res) => {
//   try {
//     const formData = await Form.find();
//     const formDataCollection = []
//     for(let i in formData){
//         console.log(formData[i].email);
//         formDataCollection.push(formData)
//     // mailer(req.body.email, formData);
//     }
//     res.status(200).json({data:formDataCollection});

//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
// const mailer = async (recepient, formData) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     secure: false,
//     auth: {
//       user: `${process.env.GMAIL_ACC}`,
//       pass: process.env.APP_PASS, //app password
//     },
//   });

//   const mailOptions = {
//     from: `GritFeatnotes@gritFeat.com`,
//     to: `${recepient}`,
//     subject: "Today's Update",
//     // text: `Your OTP code is ${otp} \n Expires in 5 minutes`,
//     html: `<h1>${formData.title}</h1>
//     <h3>${formData.desc}</h3>`,
//   };
//   await transporter.verify();

//   //send email
//   transporter.sendMail(mailOptions, function (err, res) {
//     if (err) {
//       return res.status(400).send({ Status: "Failure", Details: err });
//     } else {
//       return res.send({ Status: "Success", Details: encoded });
//     }
//   });
// };

module.exports = router;
