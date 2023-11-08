const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company:{
      type: String,
      trim:true
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
    address: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    poc:[{
      type: Schema.Types.ObjectId,
      ref: "Poc",
    }],
    projects: [{
      type: Schema.Types.ObjectId,
      ref: "Project",
    }],
  },
  {
    timestamps: true,
  }
);

schema.pre(/^find/,function(next){
  this.populate('poc');
  next();
})

schema.pre(/^find/,function(next){
  this.populate('projects');
  next();
})


const ClientModel = mongoose.model("Client", schema);
module.exports = ClientModel;
