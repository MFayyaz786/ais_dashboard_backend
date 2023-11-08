const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    // },
    employeeId:{
      type:String,
    }
    ,
    fullName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    department: {
      type: String,
    },
    // vertical: {
    //   type: String,
    // },
    status:{
        type:String,
    }
  },
  {
    timestamps: true,
  }
);
const employeeModel = mongoose.model("Employee", schema);
module.exports = employeeModel;
