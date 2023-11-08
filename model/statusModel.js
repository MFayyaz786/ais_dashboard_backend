const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const statusModel = mongoose.model("Status", schema);
module.exports = statusModel;
