const userModel = require("../model/userModel");
const resetPasswordModel = require("../model/resetPasswordModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const { projection } = require("../db/projection");
const PMOLogsModel = require("../model/PMOLogsModel");
const moment = require("moment-timezone");
const userServices = {
  login: async (email, password) => {
    const customer = await userModel.findOne(
      { email: email },
      projection.projection
    ).lean();
    if (customer) {
      // check customer password with hashed password stored in the database
      const validPassword = await bcrypt.compare(password, customer.password);
      if (validPassword) {
        const result = await userModel.findOne(
          { email: email },
          { createdAt: 0, updatedAt: 0, __v: 0, password: 0 }
        ).lean();
        return result;
      } else {
        const result = "1";
        return result;
      }
    } else {
      const result = "2";
      return result;
    }
  },
logout:async(sessionId,logoutTime)=>{
let session=await PMOLogsModel.findOne({sessionId});
loginTime=new Date(session.loginTime).getTime()
if(!logoutTime){
 logoutTime = moment().tz("Asia/Karachi").format();
}
const totalActiveTime=new Date(logoutTime).getTime()-loginTime;
console.log(totalActiveTime)
//logoutTime.setMinutes(logoutTime.getMinutes() - 5);
const result=await PMOLogsModel.findOneAndUpdate({sessionId:sessionId},{logoutTime:logoutTime,activeTime:totalActiveTime},{new:true});
console.log(result)
return result;
  },
  customerDetails: async (_id) => {
    const customer = await userModel.findOne(
      { _id },{createdAt:0,updatedAt:0,password:0,__v:0}
    );
      return customer;
  },
  addNew: async (
    firstName,
    lastName,
    email,
    contact,
    address,
    gender,
    password,
    userType
  ) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    customer = new userModel({
      firstName,
      lastName,
      email,
      password,
      contact,
      address,
      gender,
      userType
    });
    const result = await customer.save();
    return result;
  },
  updateDetails: async (
    _id,
    firstName,
    lastName,
    email,
    contact,
    address,
    gender,
  ) => {
    result = await userModel.findOneAndUpdate(
      { _id },
      {
        firstName,
        lastName,
        email,
        contact,
        address,
        gender,
      },
      {
        new: true,
      }
    );
    return result;
  },
  resetPassword: async (email) => {
    const customer = await userModel.findOne({
      email: email,
    });
    if (customer) {
      result = await sendEmail(email);
      return result;
    } else {
      return null;
    }
  },
  verifyNewPassword: async (email, otp) => {
    const customer = await resetPasswordModel.findOne({
      email: email,
      otp: otp,
    });
    if (customer) {
      await userModel.findOneAndUpdate(
        { email },
        { isVarified: true },
        { new: true }
      );
      result = "OTP Verified";
      return result;
    } else {
      result = "OTP Not Verified";
      return result;
    }
  },
  setNewPassword: async (_id, password) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const result = await userModel.findOneAndUpdate(
      { _id: _id },
      {
        password,
      },
      {
        new: true,
      }
    );
    return result;
  },
  setForgotPassword: async (email, password) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const result = await userModel.findOneAndUpdate(
      { email: email },
      {
        password,
      },
      {
        new: true,
      }
    );
    return result;
  },
  registerCustomer: async () => {
    let list = await userModel
      .find(
        {},
        {
          firstName: 1,
          lastName: 1,
          contact: 1,
          email: 1,
          address: 1,
          gender: 1,
          userType:1
        }
      )
      .lean();
    list = list.map((item) => {
      const whiteSpace = " ";
      item.customerName = item.firstName.concat(whiteSpace, item.lastName);
      delete item.firstName;
      delete item.lastName;
      return item;
    });
    return list;
  },
  registerCustomerDetails: async (_id) => {
    let result = await userModel
      .findById(
        { _id },
        {
          firstName: 1,
          lastName: 1,
          contact: 1,
          email: 1,
          address: 1,
          gender: 1,
          userType:1
        }
      )
      .lean();
    const whiteSpace = " ";
    result.customerName = result.firstName.concat(whiteSpace, result.lastName);
    delete result.firstName;
    delete result.lastName;
    return result;
  },
};

module.exports = userServices;
