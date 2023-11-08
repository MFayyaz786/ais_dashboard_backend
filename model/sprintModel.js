const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: {
      type: Schema.Types.ObjectId,
      ref: "Settings",
    },
    description: {
      type: String,
    },
    noOfResources: {
      type: Number,
    },
    estimatedHours: {
      type: Number,
    },
    startDate: {
      type: Date,
      // required: true,
    },
    endDate: {
      type: Date,
      // required: true,
    },
    employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    active: {
      type: Boolean,
    },
    // actualDate: {
    //   type: Date,
    // },
    // reason: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

schema.pre(/^find/,function(next){
  this.populate('title');
  next();
})


const SprintModel = mongoose.model("Sprint", schema);
module.exports = SprintModel;
