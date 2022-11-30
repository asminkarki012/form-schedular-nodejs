const Form = require("../models/Form");
const nodemailer = require("nodemailer");
require("dotenv").config();

//setting up cron-node to get data from db and sending data to the email
const sendMailToUser = async () => {
  const formData = await Form.find();
  console.log("Cron scheduling activated");
  for (let i in formData) {
    console.log(formData[i]);
    mailer(formData[i].email, formData[i]);
  }
};
const mailer = async (recepient, formData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: `${process.env.GMAIL_ACC}`,
      pass: process.env.APP_PASS, //app password
    },
  });

  const mailOptions = {
    from: `GritFeatnotes@gritFeat.com`,
    to: `${recepient}`,
    subject: "Today's Update",
    // text: `Your OTP code is ${otp} \n Expires in 5 minutes`,
    html: `<h1>${formData.title}</h1>
    <h3>${formData.desc}</h3>`,
  };
  await transporter.verify();

  //send email
  transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      return res.status(400).send({ Status: "Failure", Details: err });
    } else {
      return res.send({ Status: "Success", Details: encoded });
    }
  });
};

module.exports = sendMailToUser;
