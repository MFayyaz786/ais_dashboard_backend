const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const projectRouter = express.Router();
const projectServices = require("../services/projectServices");
const versionServices = require("../services/versionServices");
const sprintServices = require("../services/sprintServices");

// create

projectRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { name, riskFactor, status, client, pmo,gm, version, sprint ,billAble,isKanban,state,reason,createdBy} = req.body;
    if (
      !name ||
      !status ||
      !client ||
      !pmo ||
      !gm ||
      !version||
      !sprint
    ) {
     return res.status(400).send({
        msg: "Field Missing",
      });
    }
// if (isKanban===false && !sprint) {
//   res.status(400).send({
//     msg: "Field Missing",
//   });
// }
      const result = await projectServices.addNew(
        name,
        riskFactor,
        status,
        client,
        pmo,
        gm,
        version,
        sprint,
        billAble,
        isKanban,
        state,
        reason,
        createdBy
      );
        
        if (result) {
        return  res.status(200).send({
            msg: "Project Details Added",
            data: result,
          });
        } else {
        return  res.status(400).send({
            msg: "Project Details Not Added",
          });
        }
  })
);

//update project details
projectRouter.patch(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {
      projectId,
      name,
      pmo,
      gm,
      riskFactor,
      client,
      billAble,
      state,
      status,
      isKanban,
      reason
    } = req.body;
    // if (!name || !status || !client || !pmo || !gm || !sprint) {
    //   res.status(400).send({
    //     msg: "Field Missing",
    //   });
    // }
    // if (isKanban === false || !sprint) {
    //   res.status(400).send({
    //     msg: "Field Missing",
    //   });
    // }
    const result = await projectServices.update(
      projectId,
      name,
      pmo,
      gm,
      riskFactor,
      client,
      billAble,
      state,
      status,
      isKanban,
      reason
    );

    if (result) {
      res.status(200).send({
        msg: "Project Details Updated",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "Project Details Not Updated",
      });
    }
  })
);
// all

projectRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const {id}=req.query
    const result = await projectServices.get(id);
    if (result.length != 0) {
      res.status(200).send({
        msg: "Project Details",
        data: result,
      });
    } else {
      res.status(404).send({
        msg: " No data Found",
      });
    }
  })
);
projectRouter.get(
  "/archived",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.query;
    const result = await projectServices.archivedProjects(id);
    if (result.length != 0) {
      res.status(200).send({
        msg: "Projects",
        data: result,
      });
    } else {
      res.status(404).send({
        msg: " No data Found",
      });
    }
  })
);
projectRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { pmo,state } = req.query;
    const result = await projectServices.searchByPMOState(pmo, state);
    if (result.length != 0) {
      res.status(200).send({
        msg: "Projects",
        data: result,
      });
    } else {
      res.status(404).send({
        msg: " No data Found",
      });
    }
  })
);

// single project Details
projectRouter.get(
  "/details/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await projectServices.details(req.params.id);
    if (result.length != 0) {
      res.status(200).send({
        msg: "Project Details",
        data: result,
      });
    } else {
      res.status(404).send({
        msg: " No data Found",
      });
    }
  })
);

// getSingle
projectRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await projectServices.getOne(req.params.id);
    if (result.length != 0) {
      res.status(200).send({
        msg: "Project Details",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: " Not Found",
      });
    }
  })
);

// manage project status
projectRouter.patch(
  "/manageStatus",
  expressAsyncHandler(async (req, res) => {
    console.log("req.body", req.body);

    const { project, status } = req.body;

    if (!project || !status) {
      res.status(400).send({
        msg: "Field Missing",
      });
    }else{
      const result = await projectServices.manageStatus(project, status);
      if (result) {
        res.status(200).send({
          msg: "Project Details Updated",
          data: result,
        });
      } else {
        res.status(400).send({
          msg: "Project Status Not Updated",
        });
      }
    }
  })
);

projectRouter.patch(
  "/manageState",
  expressAsyncHandler(async (req, res) => {
    console.log('req.body', req.body)
    const { project, state } = req.body;
    if (!project || !state) {
      return res.status(400).send({
        msg: "Field Missing",
      });
    }
    const result = await projectServices.manageState(project, state);
    if (result) {
      res.status(200).send({
        msg: "Project Details Updated",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "Project State Not Updated",
      });
    }
  })
);
// update

// projectRouter.patch(
//   "/:id",
//   expressAsyncHandler(async (req, res) => {
//     const result = await projectServices.update(req.body, req.params.id);
//     if (result) {
//       res.status(200).send({
//         msg: "Project Details Updated",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msg: "Project Details Not Updated",
//       });
//     }
//   })
// );

// delete

projectRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await projectServices.delete(req.params.id);

    if (result) {
      res.status(200).send({
        msg: "Project  Deleted",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "Project  Not Deleted",
      });
    }
  })
);

module.exports = projectRouter;
