const pmoModel = require("../model/pmoModel");
const projection = require("../db/projection");
const { default: mongoose } = require("mongoose");

const pmoServices = {
  addNew: async (user, name) => {
    const data = new pmoModel({
      user: mongoose.Types.ObjectId(user),
      name,
    });
    const result = await data.save();
    return result;
  },
  get: async () => {
    const result = await pmoModel.find({}, projection.projection);
    return result;
  },
  getSingle: async (id) => {
    const result = await pmoModel.findById(id).populate({ path: "user" });
    return result;
  },
  update: async (body, id) => {
    const { name } = body;
    const result = await pmoModel.findOneAndUpdate(
      { _id: id },
      {
        name,
      },
      { runValidators: true, new: true }
    );
    return result;
  },
  updatePMOInfo: async (user, name) => {
    const result = await pmoModel.findOneAndUpdate(
      { user: user },
      {
        name:name,
      },
      { runValidators: true, new: true }
    );
    return result;
  },

  delete: async (id) => {
    const result = await pmoModel.findByIdAndDelete(id);
    return result;
  },
};
module.exports = pmoServices;
