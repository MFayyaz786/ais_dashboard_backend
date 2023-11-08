const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const gmRouter = express.Router();
const gmServices = require("../services/gmServices");

// create
gmRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
      res.status(400).send({
        msg: "Field Missing",
      });
    }else{
      const result = await gmServices.addNew(name);
      if (result) {
        res.status(200).send({
          msg: "GM Added",
          data: result,
        });
      } else {
        res.status(400).send({
          msge: "GM Not Added",
        });
      }
    }
  })
);

// get all
gmRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await gmServices.get();
    if (result.length != 0) {
      res.status(200).send({
        msg: "GM Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "GM Not Found",
      });
    }
  })
);

// getsingle gm
gmRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await gmServices.getSingle(req.params.id);

    if (result.length != 0) {
      res.status(200).send({
        msg: "gm Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: " Not Found",
      });
    }
  })
);



// update gm
gmRouter.patch(
"/:id",
expressAsyncHandler(async (req, res) => {
  const result = await gmServices.update(req.body,req.params.id );

  if (result) {
    res.status(200).send({
      msg: "gm Detials Updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msge: "gm Detials Not Updated",
    });
  }
})
);

gmRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await gmServices.delete(req.params.id);

    if (result) {
      res.status(200).send({
        msg: "gm deleted ",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "gm not deleted",
      });
    }
  })
)


module.exports = gmRouter;
