const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const sprintRouter = express.Router();
const sprintServices = require("../services/sprintServices");

// add 
sprintRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    
    const { title,noOfResources ,estimatedHours,description,startDate,endDate,version,employees,createdBy,
        isKanban,status } = req.body;
    console.log('req.body', req.body)
    if (!title  || !noOfResources  || !version) {
      res.status(400).send({
        msg: "Field Missing",
      });
    }else{
      const result = await sprintServices.addNew(
        title,
        description,
        noOfResources,
        estimatedHours,
        startDate,
        endDate,
        version,
        employees,
        createdBy,
        isKanban,
        status
      );
      if (result) {
        res.status(200).send({
          msg: "Sprint Added",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "Sprint Not Added",
      });
    }
  }
  })
);

// get all
sprintRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await sprintServices.get();
    if (result.length != 0) {
      res.status(200).send({
        msg: "Sprint Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: "Sprint Not Found",
      });
    }
  })
);

// getsingle sprint
sprintRouter.get(
  "/:id",
  
  expressAsyncHandler(async (req, res) => {
    const result = await sprintServices.getSingle(req.params.id);

    if (result.length != 0) {
      res.status(200).send({
        msg: "sprint Detials",
        data: result,
      });
    } else {
      res.status(400).send({
        msge: " Not Found",
      });
    }
  })
);



// update sprint
sprintRouter.patch(
"/:id",
expressAsyncHandler(async (req, res) => {
  const result = await sprintServices.update(req.body,req.params.id );

  if (result) {
    res.status(200).send({
      msg: "Sprint details updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msg: "Sprint details not updated",
    });
  }
})
);

// update sprint by add new employees
sprintRouter.patch(
"/newEmployee/:id",
expressAsyncHandler(async (req, res) => {
  const result = await sprintServices.addNewEmployees(req.body.employees,req.params.id );
  if (result) {
    res.status(200).send({
      msg: "Sprint details updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msg: "Sprint details not updated",
    });
  }
})
);
// update sprint by remove employees
sprintRouter.patch(
"/removeEmployee/:id",
expressAsyncHandler(async (req, res) => {
  const result = await sprintServices.removeEmployees(req.body.employee,req.params.id );
  if (result) {
    res.status(200).send({
      msg: "Sprint details updated",
      data: result,
    });
  } else {
    res.status(400).send({
      msg: "Sprint details not updated",
    });
  }
})
);
sprintRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await sprintServices.delete(req.params.id);

    if (result) {
      res.status(200).send({
        msg: "sprint deleted ",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "sprint not deleted",
      });
    }
  })
)


module.exports = sprintRouter;
