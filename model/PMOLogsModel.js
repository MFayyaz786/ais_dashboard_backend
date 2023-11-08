const mongoose = require('mongoose');
const userActivitySchema = new mongoose.Schema({
  pmo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: String },
  loginTime: { type: String, required: true },
  logoutTime: { type: String },
  activeTime: { type: Number, default: 0 },
});
const PMOLogsModel = mongoose.model('PMOLog', userActivitySchema);
module.exports = PMOLogsModel;
