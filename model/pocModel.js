const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email:{
      type: String,
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const pocModel = mongoose.model("Poc", schema);
module.exports = pocModel;
