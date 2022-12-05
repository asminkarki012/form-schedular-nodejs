const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const formsubmitRoute = require("./routes/formsubmit");
const authRoute = require("./routes/auth");
const fetchDataRoute = require("./routes/fetchdata");
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

app.use("/api/formsubmit", formsubmitRoute);

app.use("/api/auth", authRoute);

app.use("/api/fetchdata", fetchDataRoute);

// console.log(path.join(__dirname, "public/auth.html"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/auth.html"));
});

app.use(express.static(path.join(__dirname, "public")));
//setting up cron tab to send mail everyday exact @ 5pm
cron.schedule("45 17 * * *", () => {
  console.log("Running everday at 5.45pm");
  sendMailToUser();
});

const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Port Running at localhost:${PORT}`);
});
