const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const pmoRouter = express.Router();
const pmoServices = require("../services/pmoServices");

// create
pmoRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
      res.status(400).send({
        msg: "Field Missing",
      });
    }else{
      const result = await pmoServices.addNew(name);
      if (result) {
        res.status(200).send({
          msg: "PMO Added",
          data: result,
        });
      } else {
        res.status(400).send({
          msge: "PMO Not Added",
        });
      }
    }
  })
);

// get all
pmoRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await pmoServices.get();
    if (result.length != 0) {
      res.status(200).send({
        msg: "PMO Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "PMO Not Found",
      });
    }
  })
);

// getsingle pmo
pmoRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await pmoServices.getSingle(req.params.id);

    if (result.length != 0) {
      res.status(200).send({
        msg: "pmo Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: " Not Found",
      });
    }
  })
);



// update pmo
pmoRouter.patch(
"/:id",
expressAsyncHandler(async (req, res) => {
  const result = await pmoServices.update(req.body,req.params.id );

  if (result) {
    res.status(200).send({
      msg: "pmo Detials Updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msge: "pmo Detials Not Updated",
    });
  }
})
);

pmoRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await pmoServices.delete(req.params.id);

    if (result) {
      res.status(200).send({
        msg: "pmo deleted ",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "pmo not deleted",
      });
    }
  })
)


module.exports = pmoRouter;
