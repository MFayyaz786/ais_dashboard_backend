const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    version:{
        type:Boolean,
        default:false
    },
    sprint:{
        type:Boolean,
        default:false
    },
  },
  {
    timestamps: true,
  }
);

const settingsModel = mongoose.model("Settings", schema);
module.exports = settingsModel;
