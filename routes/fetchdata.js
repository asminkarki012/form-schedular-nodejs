const router = require("express").Router();
const Form = require("../models/Form");
const verifyToken = require("../controllers/middleware");
const { parse } = require("json2csv");
const fs = require("fs");
const path = require("path");
// route to get individual data through email
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const formExists = await Form.findOne({ email: req.params.email });
    console.log("email route running ");
    // console.log(req.body.content);
    if (formExists) {
      res.status(200).json({
        data: formExists,
      });
    } else {
      res.status(400).json({ message: "Form doesnot exist" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//admin route to get all data

router.get("/admin/getalldata",verifyToken,async (req, res) => {
  try {
    console.log("admin route");
    const formExist = await Form.find({});
    // console.log(formExist[0].content[0].title);
    // const fields = ["_id", "email", "content"];
    // const opts = { fields,unwindArrays:true};
    if (formExist) {
      // const csv = convertor(formExist,opts);
      // fs.writeFile(
      //   `data${Date.now() / (60 * 1000)}.csv`,
      //   csv,
      //   function (error) {
      //     if (error) throw error;
      //     console.log("Written successfully");
      //   }
      // );

      // console.log(csv);

      res.status(200).json({
        data: formExist,
      });
    } else {
      res.status(400).json({ message: "Form doesnot exist" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/admin/exportcsv",verifyToken,async (req, res) => {
  try {
    console.log("admin route export route");

    const csvFilePath = path.join(__dirname,"..","CSVfile");
    const formExist = await Form.find({});
    // console.log(formExist[0].content[0].title);
    const fields = ["_id", "email", "content"];
    const opts = { fields };
    if (formExist) {
      const csv = parse(formExist, opts);

      fs.writeFile(
        `${csvFilePath}/data${Math.round(Date.now() / (60 * 1000))}.csv`,
        csv,
        function (error) {
          if (error) throw error;
          console.log("Written successfully");
        }
      );

      res.status(200).json({message:"CSV file exported successfully"});
    } else {
      res.status(400).json({ message: "Form doesnot exist" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
