const express = require("express");
const app = express();
const port = 8081;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const user=require("../userdb/userdb")
require('dotenv').config()
app.use("/",router);
const bcrypt = require("bcryptjs");
const JWT_SECRET_KEY = "CODERED";
const jwt = require("jsonwebtoken");


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

router.post("/signup", async (req, res) => {
    const {email, password } = req.body;
    const existing = await user.findOne({ email: email });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    if (existing !== null) {
        res.status(200).json({
          status: "failed",
          message: "User already exists with this email, kindly login",
        });
      }else{
        const savedbooksdata = new user({
            email: email,
            password: hashPassword
        });
        savedbooksdata.save(function (err,data) {
          if (err){
            console.log(err)
          }else{
            res.send(JSON.stringify({message:'user data is registered',bookdata:data}))
          }
        });
      }
});

router.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const userdetails = await user.findOne({ email: email });
      if (!userdetails) {
        res.status(200).json({
          status: "failed",
          message: "Email does not exists kindly register first",
        });
      } else {
        const isPasswordMatching = await bcrypt.compare(password, userdetails.password);
        const token = jwt.sign({email:email,id:userdetails._id}, JWT_SECRET_KEY);
        if (isPasswordMatching) {
          res.status(200).json({
            status: "success",
            message: "Welcome!! authentication successful, you are logged in successfully",
            jwt_token: token,
            userid:userdetails._id
          });
        } else {
          res.status(200).json({
            status: "failed",
            message: "authentication failed, email or password is incorrect",
          });
        }
      }
  });
  


mongoose.connect(
    process.env.MONGODB_URI
    )
  .then(() => console.log("db user connected"));


  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})