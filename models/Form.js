const mongoose = require("mongoose");
// const { Schema } = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    content: [
      {
        title:String,
        desc:String
       
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
