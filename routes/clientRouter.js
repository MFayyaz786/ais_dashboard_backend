const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const clientRouter = express.Router();
const clientServices = require("../services/clientServices");



// create client
clientRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      company,
      email,
      contact,
      address,
      country,
      city,
      website,
      poc
    } = req.body;
    if (
      !name
    ) {
      res.status(400).send({
        msg: "Name  Required",
      });
    }else{
      const result = await clientServices.addNew(
        name,
        company,
        email,
        contact,
        address,
        country,
        city,
        website,
        poc
        );
        if (result) {
          res.status(200).send({
            msg: "client Detials Added",
            data: result,
          });
        } else {
          res.status(400).send({
            msge: "client Detials Not Added",
          });
        }
    }
  })
);

// get 
clientRouter.get(
    "/all",
    expressAsyncHandler(async (req, res) => {
      const result = await clientServices.get();

      if (result) {
        res.status(200).send({
          msg: "client Detials",
          data: result,
        });
      } else {
        res.status(400).send({
          msge: "something bad happend",
        });
      }
    })
);

// getsingle client
clientRouter.get(
    "/:id",
    expressAsyncHandler(async (req, res) => {
      const result = await clientServices.getClient(req.params.id);
      if (result) {
        res.status(200).send({
          msg: "client Detials",
          data: result,
        });
      } else {
        res.status(400).send({
          msge: "client Detials Not Found ",
        });
      }
    })
);

  

// update client
clientRouter.patch(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await clientServices.update(req.body,req.params );

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

clientRouter.delete(
    "/:id",
    expressAsyncHandler(async (req, res) => {
      const result = await clientServices.delete(req.params.id);
  
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
);



module.exports = clientRouter;
