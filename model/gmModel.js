const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    projects:[{
      type: Schema.Types.ObjectId,
      ref: "Project",
    }]
    
  },
  {
    timestamps: true,
  }
);

schema.pre(/^find/,function(next){
  this.populate('projects');
  next();
})



const gmModel = mongoose.model("GM", schema);
module.exports = gmModel;
