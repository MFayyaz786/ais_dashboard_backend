const settingsModel = require("../model/settingsModel");
const projection = require("../db/projection");

const pmoServices = {
  addNew: async (name,version,sprint) => {
    const data = new settingsModel({
      name,
      version,
      sprint
    });
    const result = await data.save();
    return result;
  },
  get: async () => {
    const result = await settingsModel.find({}, projection.projection);
    return result;
  },
  getSingle: async (id) => {
    const result = await settingsModel.findById(id);
    return result;
  },
  update: async (body,id) => {
    const {name,version,sprint}=body    
    const result = await settingsModel.findOneAndUpdate(
      { _id: id },
      {
      name,
      version,
      sprint
      },
      {runValidators:true,new:true}
    );
    return result;
  },
  delete: async (id) => {
    const result = await settingsModel.findByIdAndDelete(id);
    return result;
  },

};
module.exports = pmoServices;
