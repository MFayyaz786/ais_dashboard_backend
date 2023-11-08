const statusModel = require("../model/statusModel");
const projection = require("../db/projection");

const statusServices = {
  addNew: async (status) => {
    const data = new statusModel({
      status,
    });
    const result = await data.save();
    return result;
  },
  update:async(_id,status)=>{
const result=await statusModel.findOneAndUpdate({_id},{status},{new:true});
return result
  },
  get: async () => {
    const result = await statusModel.find({}, projection.projection);
    return result;
  },
  getOne: async (_id) => {
    const result = await statusModel.findOne({_id}, projection.projection);
    return result;
  },
  delete:async(_id)=>{
    const result=await statusModel.deleteOne({_id});
    return result
  }
};
module.exports = statusServices;
