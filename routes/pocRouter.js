const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const pocRouter = express.Router();
const pocServices = require("../services/pocServices");

// add
pocRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { name,email,contact,client} = req.body;
    if (!name || !client) {
      res.status(400).send({
        msg: "Field Missing",
      });
    }else{
      const result = await pocServices.addNew(name,email,contact,client);
      if (result) {
      res.status(200).send({
        msg: "POC Added",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "POC Not Added",
      });
    }
  }
  })
);

// get all
pocRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await pocServices.get();
    if (result.length != 0) {
      res.status(200).send({
        msg: "POC Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "POC Not Found",
      });
    }
  })
);

// getsingle poc
pocRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await pocServices.getSingle(req.params.id);

    if (result.length != 0) {
      res.status(200).send({
        msg: "client Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: " Not Found",
      });
    }
  })
);



// update client
pocRouter.patch(
"/:id",
expressAsyncHandler(async (req, res) => {
  const result = await pocServices.update(req.body,req.params.id );

  if (result) {
    res.status(200).send({
      msg: "client Detials Updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msge: "client Detials Not Updated",
    });
  }
})
);

pocRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await pocServices.delete(req.params.id);

    if (result) {
      res.status(200).send({
        msg: "client deleted ",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "client not deleted",
      });
    }
  })
)


module.exports = pocRouter;
