const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const versionRouter = express.Router();
const versionServices = require("../services/versionServices");


// Add
versionRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {
      title,
      description,
      noOfResources,
      estimatedHours,
      startDate,
      endDate,
      project,
      employees,
      createdBy,
      isKanban,
      status,
      actualDate,
      reason
    } = req.body;
    if (!title ||!project) {
    return  res.status(400).send({
        msg: "Field Missing",
      });
    }

    const result = await versionServices.addNew(
      title,
      description,
      noOfResources,
      estimatedHours,
      startDate,
      endDate,
      project,
      employees,
      createdBy,
      isKanban,
      status,
      actualDate,
      reason
    );
    if (result) {
      res.status(200).send({
        msg: "Version Added",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "Version Not Added",
      });
    }
  })
);


// get all
versionRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await versionServices.get();
    if (result.length != 0) {
      res.status(200).send({
        msg: "Version Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "Version Not Found",
      });
    }
  })
);

// getsingle version
versionRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await versionServices.getSingle(req.params.id);
    if (result) {
      res.status(200).send({
        msg: "version Details",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: " Not Found",
      });
    }
  })
);



// update version
versionRouter.patch(
"/:id",
expressAsyncHandler(async (req, res) => {
  const result = await versionServices.update(req.body,req.params.id );

  if (result) {
    res.status(200).send({
      msg: "version Details Updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msg: "version Details Not Updated",
    });
  }
})
);
// update version by add new employees
versionRouter.patch(
"/newEmployee/:id",
expressAsyncHandler(async (req, res) => {
  const result = await versionServices.addNewEmployees(req.body.employees,req.params.id );
  if (result) {
    res.status(200).send({
      msg: "Version details updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msg: "Version details not updated",
    });
  }
})
);
// update version by remove employees
versionRouter.patch(
"/removeEmployee/:id",
expressAsyncHandler(async (req, res) => {
  const result = await versionServices.removeEmployees(req.body.employee,req.params.id );
  if (result) {
    res.status(200).send({
      msg: "Version details updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msg: "Version details not updated",
    });
  }
})
);
versionRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await versionServices.delete(req.params.id);
    if (result) {
      res.status(200).send({
        msg: "version deleted ",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "version not deleted",
      });
    }
  })
)


module.exports = versionRouter;
