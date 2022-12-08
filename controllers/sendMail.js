const Form = require("../models/Form");
const nodemailer = require("nodemailer");
require("dotenv").config();

//setting up cron-node to get data from db and sending data to the email
const sendMailToUser = async () => {
  const formData = await Form.find();
  console.log("Cron scheduling activated");
  // console.log(formData[0].email);
  // console.log(latestcontent)
  for (let i in formData) {
    let latestcontent = formData[i].content.length - 1;
    // console.log(formData[i].content[latestcontent]);
    if (formData[i].content[latestcontent] !== undefined) {
      console.log(formData[i].email, formData[i].content[latestcontent]);
      mailer(formData[i].email, formData[i].content[latestcontent]);
    }
  }
};
const mailer = async (recepient, content) => {
  // console.log(content);
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
    from: "GritFeatnotes@gritFeat.com",
    to: `${recepient}`,
    subject: "Today's Update",
    // text: `Your OTP code is ${otp} \n Expires in 5 minutes`,
    html: `<h1>${content.title}</h1>
    <h3>${content.desc}</h3>`,
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
