const gmModel = require("../model/gmModel");
const projection = require("../db/projection");

const gmServices = {
  addNew: async (name) => {
    const data = new gmModel({
      name,
    });
    const result = await data.save();
    return result;
  },
  get: async () => {
    const result = await gmModel.find({}, projection.projection);
    return result;
  },
  getSingle: async (id) => {
    const result = await gmModel.findById(id);
    return result;
  },
  update: async (body,id) => {
    const {name}=body    
    const result = await gmModel.findOneAndUpdate(
      { _id: id },
      {
      name,
      },
      {runValidators:true,new:true}
    );
    return result;
  },

  delete: async (id) => {
    const result = await gmModel.findByIdAndDelete(id);
    return result;
  },
};
module.exports = gmServices;
