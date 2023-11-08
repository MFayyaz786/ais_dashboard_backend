const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    finishDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    estimateHours: {
      type: Number,
      required: true,
    },
    onTrack: {
      type: Boolean,
      default: true,
    },
    riskFactor: {
      type: Number,
      required: true,
    },
    goLiveDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    currentSpirit: {
      type: String,
      required: true,
      default: "Sipirit",
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    pmo: {
      type: Schema.Types.ObjectId,
      ref: "PMO",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const DashboardModel = mongoose.model("Dashboard", schema);
module.exports = DashboardModel;
