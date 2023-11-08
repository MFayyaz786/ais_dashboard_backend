const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    riskFactor: {
      type: Number,
      enum: [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    status: {
      type: Schema.Types.ObjectId,
      ref:"Status",
      // enum: [
      //   "Requirement Gathering",
      //   "Waiting for Approval",
      //   "R&D",
      //   "Development",
      //   "QA",
      //   "UAT",
      //   "On-Going Enhancement",
      //   "On Support",
      //   "Client Signed-Off",
      // ],
       required: [true, `Please Provide status`],
    },
    // img:{
    //   type:String,
    //   default:"/images/profile.png"
    // },
    state: {
      type: String,
      enum: ["On Hold","On Track", "Delayed", "Closed"],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    pmo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    gm: {
      type: Schema.Types.ObjectId,
      ref: "GM",
    },
    versions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Version",
      },
    ],
    billAble:{
      type:Boolean,
      default:true
    },
    isKanban:{
      type:Boolean,
      default:true
    },
    reason:{
      type:String,
      default:null
    }
  },
  {
    timestamps: true,
  }
);
const ProjectModel = mongoose.model("Project", schema);
module.exports = ProjectModel;
