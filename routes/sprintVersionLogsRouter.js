const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const sprintVersionLogsServices = require("../services/sprintVersionLogsServices");
const sprintVersionLogsRouter = express.Router();
sprintVersionLogsRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
     const result=await sprintVersionLogsServices.getAll();
     res.status(200).send({msg:"Logs",data:result})
  })
);
sprintVersionLogsRouter.get(
  "/project/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await sprintVersionLogsServices.getByProject(req.params.id);
    res.status(200).send({ msg: "Logs", data: result });
  })
);
module.exports = sprintVersionLogsRouter;
