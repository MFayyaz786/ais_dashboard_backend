const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    isKanban: { Boolean },
    sprint: Object,
    version: Object,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


const SprintVersionLogsModel = mongoose.model("SprintVersionLogs", schema);
module.exports = SprintVersionLogsModel;
