const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const PMOLogsServices = require("../services/PMOLogsServices");
const PMOLogsRouter = express.Router();
PMOLogsRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await PMOLogsServices.DailyActiveLogs(req.query.fromDate,req.query.toDate);
    res.status(200).send({ msg: "Logs", data: result });
  })
);
PMOLogsRouter.get(
  "/pmo/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await PMOLogsServices.getByPMO(req.params.id,req.query.fromDate,req.query.toDate);
    if(result){
    res.status(200).send({ msg: "Log", data: result });
    }else{
    res.status(404).send({ msg: "Not Found!"});  
    }
  })
);
PMOLogsRouter.get(
  "/session/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await PMOLogsServices.getOne(req.params.id);
    if (result) {
      res.status(200).send({ msg: "Log", data: result });
    } else {
      res.status(404).send({ msg: "Not Found!" });
    }
  })
);
module.exports = PMOLogsRouter;
