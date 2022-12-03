const express = require("express");
const app = express();
const port = 8081;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const user=require("../userdb/userdb")
require('dotenv').config()
app.use("/",router);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

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

console.log("here",process.env.MONGODB_URI)
mongoose.connect(
    process.env.MONGODB_URI
    )
  .then(() => console.log("db user connected"));


  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})