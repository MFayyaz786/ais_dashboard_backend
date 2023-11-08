const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const settingsRouter = express.Router();
const settingsServices = require("../services/settingsServices");

// create
settingsRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { name,version,sprint } = req.body;
    const result = await settingsServices.addNew(name,version,sprint);
    if (result) {
      res.status(200).send({
        msg: "details Added",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "details Not Added",
      });
    }
  })
);

// get all
settingsRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await settingsServices.get();
    if (result.length != 0) {
      res.status(200).send({
        msg: "Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "data Not Found",
      });
    }
  })
);

// getsingle settings
settingsRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await settingsServices.getSingle(req.params.id);

    if (result.length != 0) {
      res.status(200).send({
        msg: "settings Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "data Not Found",
      });
    }
  })
);



// update settings
settingsRouter.patch(
"/:id",
expressAsyncHandler(async (req, res) => {
  const result = await settingsServices.update(req.body,req.params.id );

  if (result) {
    res.status(200).send({
      msg: "settings Detials Updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msge: "settings Detials Not Updated",
    });
  }
})
);

settingsRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await settingsServices.delete(req.params.id);

    if (result) {
      res.status(200).send({
        msg: "settings deleted",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "settings not deleted",
      });
    }
  })
)


module.exports = settingsRouter;
