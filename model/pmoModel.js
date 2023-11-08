const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema(
  {
    user:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    name: {
      type: String,
    },
    // email
    // contact

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



const pmoModel = mongoose.model("PMO", schema);
module.exports = pmoModel;
