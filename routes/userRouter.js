const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const userServices = require("../services/userServices");
const userRouter = express.Router();
const validator = require("../utils/passwordValidator");
const pmoServices = require("../services/pmoServices");
const PMOLogsModel = require("../model/PMOLogsModel");
const moment = require("moment-timezone");
const { v4: uuidv4 } = require('uuid');
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      contact,
      address,
      gender,
      password,
      reEnterPassword,
      userType
    } = req.body;

    if (password !== reEnterPassword) {
      return res.status(400).send({ msg: "Passwords Don't Match" });
    }
    if (!validator.schema.validate(password)) {
      return res.status(400).send({
        msg: validator.schema.validate(password, { list: true }),
      });
    }
    const result = await userServices.addNew(
      firstName,
      lastName,
      email,
      contact,
      address,
      gender,
      password,
      userType
    );
    if (result) {
      if (result.userType === "pmo") {
        await pmoServices.addNew(result._id,firstName.concat(" ", lastName));
      }
      return res.status(200).send({ msg: "Registered successfully" });
    } else {
      return res.status(400).send({ msg: "User not Registered" });
    }
  })
);
userRouter.patch(
  "/updateUserProfile",
  expressAsyncHandler(async (req, res) => {
    const { userId, firstName, lastName, email, contact, address, gender } =
      req.body;
    if (
      !userId ||
      !firstName ||
      !lastName ||
      !email ||
      !contact ||
      !address ||
      !gender
    ) {
      return res.status(400).send({ msg: "Fields Missing" });
    }

    const result = await userServices.updateDetails(
      userId,
      firstName,
      lastName,
      email,
      contact,
      address,
      gender
    );
    if (result) {
       if (result.userType === "pmo") {
         await pmoServices.updatePMOInfo(
           userId,
           firstName.concat(" ", lastName)
         );
       }
      return res.status(200).send({ msg: "User updated.", data: result });
    } else {
      return res.status(400).send({ msg: "user not updated" });
    }
  })
);
userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    let result = await userServices.login(email, password);
    if (result == "1") {
      res.status(400).json({ msg: "Incorrect Password" });
    }
    if (result == "2") {
      res.status(400).json({ msg: "Customer doesn't exist" });
    } else {
      if(result.userType==='pmo'){
        const sessionId=uuidv4()
       // const options = { timeZone: 'Asia/Karachi' };
        const loginTime = moment().tz("Asia/Karachi").format();
        console.log(loginTime)
       const data=new PMOLogsModel({
        sessionId,
        pmo:result._id,
        loginTime
       });
       await data.save()
       result.sessionId=sessionId
      }
      res.status(200).json({ msg: "Logged In Successfully", data: result });
    }
  })
);
userRouter.post("/logout",expressAsyncHandler(async(req,res)=>{
  const result=await userServices.logout(req.query.sessionId,req.query.logoutTime);
  if(result){
  return res.status(200).send({msg:"Logout successfully"})
  }else{
  return res.status(400).send({msg:"Failed!"})
  }
}))
userRouter.get(
  "/details",
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.query;
    const result = await userServices.customerDetails(userId);
    if (result) {
      res.status(200).json({ msg: "user",data:result });
    } else {
      res.status(404).json({ msg: "user doesn't exist" });
    }
  })
);
userRouter.post(
  "/resetpassword/otp",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await userServices.resetPassword(email);
    if (result) {
      res.status(200).json({ msg: "link sent" });
    } else {
      res.status(400).json({ msg: "link not sent" });
    }
  })
);
userRouter.post(
  "/resetpassword/verify",
  expressAsyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const result = await userServices.verifyNewPassword(email, otp);
    if (result == "OTP Verified") {
      res.status(200).json({ msg: result });
    }
    if (result == "OTP Not Verified") {
      res.status(400).json({ msg: result });
    }
  })
);
userRouter.post(
  "/resetpassword/set",
  expressAsyncHandler(async (req, res) => {
    const { userId, password, reEnterPassword } = req.body;
    if (password !== reEnterPassword) {
      return res.status(400).send({ msg: "Passwords Don't Match" });
    }
    const result = await userServices.setNewPassword(userId, password);
    if (result) {
      res.status(200).json({ msg: "Password Updated", data: result });
    } else {
      res.status(400).json({ msg: "Password Not Updated" });
    }
  })
);
userRouter.post(
  "/resetpassword/forgot",
  expressAsyncHandler(async (req, res) => {
    const { email, password, reEnterPassword } = req.body;
    if (password !== reEnterPassword) {
      return res.status(400).send({ msg: "Passwords Don't Match" });
    }
    const result = await userServices.setForgotPassword(email, password);
    if (result) {
      res.status(200).json({ msg: "Password Updated" });
    } else {
      res.status(400).json({ msg: "Password Not Updated" });
    }
  })
);
userRouter.get(
  "/registeredUser",
  expressAsyncHandler(async (req, res) => {
    const result = await userServices.registerCustomer();
    if (result.length != 0) {
      res.status(200).json({ msg: "Registered User ", data: result });
    } else {
      res.status(400).json({ msg: "Registered User Not Found" });
    }
  })
);
module.exports = userRouter;
