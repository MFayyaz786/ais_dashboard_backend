const pocModel = require("../model/pocModel");
const clientModel = require("../model/clientModel");
const projection = require("../db/projection");
const { findById } = require("../model/pocModel");

const pocServices = {
  addNew: async (name,email,contact,client) => {
    const data = new pocModel({
      name,
      email,
      contact,
    });

    const data2=await clientModel.findById(client)
    data2.poc.unshift(data._id)
    await data2.save()

    const result = await data.save();
    return result;
  },

  get: async () => {
    const result = await pocModel.find({}, projection.projection);
    return result;
  },

  getSingle: async (id) => {
    const result = await pocModel.findById(id);
    return result;
  },
  
  update: async (body,id) => {
    const {name,email,contact}=body
    
    const result = await pocModel.findOneAndUpdate(
      { _id: id },
      {
      name,
      email,
      contact
      },
      {runValidators:true,new:true}
    );
    return result;
  },

  delete: async (id) => {
    const result = await pocModel.findByIdAndDelete(id);
    return result;
  },

};
module.exports = pocServices;
