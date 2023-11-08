const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    noOfResources: {
      type: Number,
    },
    estimatedHours: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre(/^find/, function (next) {
  this.populate("title");
  next();
});

const kanbanModel = mongoose.model("Kanban", schema);
module.exports = kanbanModel;
