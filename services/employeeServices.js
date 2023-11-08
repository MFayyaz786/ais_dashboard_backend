const employeeModel = require("../model/employeeModel");
const projection = require("../db/projection");
const axios=require("axios");
const employeeServices = {
  addNew: async (id, name, designation, department, vertical, status) => {
    const data = new employeeModel({
      id,
      name,
      designation,
      department,
      vertical,
       status,
    });
    console.log(emp)
    const result = await data.save();
    return result;
  },
  update: async (_id,body) => {
    const {id, name, designation, department, vertical, status}=body
    const result = await employeeModel.findOneAndUpdate(
      { _id },
      { id, name, designation, department, vertical,  status },
      { new: true }
    );
    return result;
  },
  updateStatus: async (_id, status) => {
    const result = await employeeModel.findOneAndUpdate(
      { _id },
      {   status },
      { new: true }
    );
    return result;
  },
  get: async () => {
    const result = await employeeModel.find(
      { status: "True" },
      projection.projection
    );
    return result;
  },
  getOne: async (_id) => {
    const result = await employeeModel.findOne({ _id }, projection.projection);
    return result;
  },
  delete: async (_id) => {
    const result = await employeeModel.deleteOne({ _id });
    return result;
  },
};
module.exports = employeeServices;
