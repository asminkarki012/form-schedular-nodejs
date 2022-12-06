const router = require("express").Router();
const Form = require("../models/Form");
const verifyToken = require("../controllers/middleware");

router.get("/:email", verifyToken ,async (req, res) => {
  try {
    const formExists = await Form.findOne({ email: req.params.email });
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

module.exports=router;