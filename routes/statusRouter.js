const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const statusRouter = express.Router();
const statusServices = require("../services/statusServices");
const projectServices = require("../services/projectServices");
statusRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status) {
      res.status(400).send({
        msg: "Field Missing",
      });
    }else{

      const result = await statusServices.addNew(status);
      if (result) {
      res.status(200).send({
        msg: "status Added",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "status Not Added",
      });
    }
  }
  })
);
statusRouter.put(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { statusId,status } = req.body;
    if (!status||!statusId) {
      res.status(400).send({
        msg: "Field Missing",
      });
    } else {
      const result = await statusServices.update(statusId, status);
      if (result) {
        res.status(200).send({
          msg: "status updated",
          data: result,
        });
      } else {
        res.status(400).send({
          msg: "status Not updated",
        });
      }
    }
  })
);
statusRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await statusServices.get();
    if (result.length != 0) {
      res.status(200).send({
        msg: "status List",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "status Not Found",
      });
    }
  })
);
statusRouter.get(
  "/getOne",
  expressAsyncHandler(async (req, res) => {
    const {statusId}=req.query
    const result = await statusServices.getOne(statusId);
    if (result) {
      res.status(200).send({
        msg: "status Details",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "status Not Found",
      });
    }
  })
);
statusRouter.delete(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { statusId } = req.query;
    const isUse=await projectServices.isUse(statusId);
    if(isUse){
      return res.status(400).send({
        msg:"This status use for a project!"
      })
    }
    const result = await statusServices.delete(statusId);
    if(result.deletedCount===0){
      res.status(404).send({
        msg: "Not Found!",
      });
    }
    if (result) {
      res.status(200).send({
        msg: "status deleted",
      });
      return;
    } else {
      res.status(400).send({
        msg: "status Not deleted",
      });
      return;
    }
  })
);
module.exports = statusRouter;
