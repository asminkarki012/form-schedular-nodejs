const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const formsubmitRoute = require("./routes/formsubmit");
const cron = require("node-cron");
const sendMailToUser = require("./controllers/sendMail");

//DB connection
main().catch((err) => console.log(err));

async function main() {
  mongoose.connect(process.env.MONGO_DB);
  console.log("MongoDB connected");
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api/formsubmit", formsubmitRoute);

//setting up cron tab to send mail everyday exact @ 5pm
cron.schedule("56 14 * * *", () => {
  console.log("Running everday at 5pm");
  sendMailToUser();
});

const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Port Running at localhost:${PORT}`);
});
