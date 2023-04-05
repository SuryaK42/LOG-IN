const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./userSchema");
const validator = require("email-validator");
var passwordValidator = require("password-validator");
var schema = new passwordValidator();

schema
  .is()
  .min(8)
  .is()
  .max(10)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

router.get("/dummyData", (req, res) => {
  res.json({ name: "surya" });
});

router.post("/register", async (req, res) => {
  try {
    const emailCheck = validator.validate(req.body.email);
    if (!emailCheck) {
      return res.status(400).json("Enter Valid Email");
    }
    const passCheck = schema.validate(req.body.password);
    if (!passCheck) {
      return res.status(402).json("Enter a Strong Password");
    }
    var emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(404).json("Email Already Exist");
    }

    var hash = await bcrypt.hash(req.body.password, 10);

    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    var data = await user.save();
    res.json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  try {
    var userData = await User.findOne({ email: req.body.email });

    if (!userData) {
      return res.status(400).json("Email Doesn't Exist");
    }
    var validPsw = await bcrypt.compare(req.body.password, userData.password);
    if (!validPsw) {
      return res.status(400).json("Password doesn't right");
    }

    var userToken = await jwt.sign({ email: userData.email }, "secret", {
      expiresIn: "50s",
    });

    res.json({ token: userToken });
  } catch (error) {
    res.status(400).json(error);
  }
});

const validUser = (req, res, next) => {
  var token = req.header("Authorization");
  req.token = token.split(" ")[1];
  next();
};

router.post("/get", validUser, async (req, res) => {
  jwt.verify(req.token, "secret", async (err, datas) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const data = await User.find({ email: datas.email }).select([
        "-password",
      ]);
      res.json(data);
    }
  });
});

module.exports = router;
