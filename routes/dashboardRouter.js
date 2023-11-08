const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const dashboardRouter = express.Router();
const dashboardServices = require("../services/dashboardServices");



// Dashboard

dashboardRouter.get(
    "/",
    expressAsyncHandler(async (req, res) => {
    const result = await dashboardServices.dashboard();
    if (result) {
        res.status(200).send({
        msg: "Dashboard Detials ",
        data: result,
    });
    } else {
        res.status(400).send({
            msge: "Dashboard Detials not found",
        });
    }
})
);

module.exports = dashboardRouter;




// dashboardRouter.post(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     const {
//       projectName,
//       startDate,
//       finishDate,
//       estimateHours,
//       onTrack,
//       riskFactor,
//       goLiveDate,
//       currentSpirit,
//       state,
//       pmo,
//     } = req.body;
//     if (
//       !projectName ||
//       !estimateHours ||
//       !riskFactor ||
//       !currentSpirit ||
//       !state ||
//       !pmo
//     ) {
//       res.status(400).send({
//         msg: "Field Missing",
//       });
//     }
//     const result = await dashboardServices.addNew(
//       projectName,
//       startDate,
//       finishDate,
//       estimateHours,
//       onTrack,
//       riskFactor,
//       goLiveDate,
//       currentSpirit,
//       state,
//       pmo
//     );
//     if (result) {
//       res.status(200).send({
//         msg: "Project Detials Added",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: "Project Detials Not Added",
//       });
//     }
//   })
// );
// dashboardRouter.patch(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     const {
//       projectId,
//       projectName,
//       startDate,
//       finishDate,
//       estimateHours,
//       onTrack,
//       riskFactor,
//       goLiveDate,
//       currentSpirit,
//       state,
//       pmo,
//     } = req.body;
//     const result = await dashboardServices.update(
//       projectId,
//       projectName,
//       startDate,
//       finishDate,
//       estimateHours,
//       onTrack,
//       riskFactor,
//       goLiveDate,
//       currentSpirit,
//       state,
//       pmo
//     );
//     if (result) {
//       res.status(200).send({
//         msg: "Project Detials Updated",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: "Project Detials Not Updated",
//       });
//     }
//   })
// );
// dashboardRouter.patch(
//   "/updateState",
//   expressAsyncHandler(async (req, res) => {
//     const { projectId, state } = req.body;
//     if (!projectId || !state) {
//       res.status(400).send({
//         msg: "Field Missing",
//       });
//     }
//     const result = await dashboardServices.updateState(projectId, state);
//     if (result) {
//       res.status(200).send({
//         msg: "Project State Updated",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: "Project State Not Updated",
//       });
//     }
//   })
// );
// dashboardRouter.get(
//   "/all",
//   expressAsyncHandler(async (req, res) => {
//     const result = await dashboardServices.get();
//     if (result.length != 0) {
//       res.status(200).send({
//         msg: "Project Detials",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: " Not Found",
//       });
//     }
//   })
// );
// dashboardRouter.get(
//   "/getOne",
//   expressAsyncHandler(async (req, res) => {
//     const { projectId } = req.query;
//     const result = await dashboardServices.getOne(projectId);
//     if (result) {
//       res.status(200).send({
//         msg: "Project Detials",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: " Not Found",
//       });
//     }
//   })
// );
// dashboardRouter.get(
//   "/stateProjects",
//   expressAsyncHandler(async (req, res) => {
//     const { stateId } = req.query;
//     const result = await dashboardServices.getState(stateId);
//     if (result.length != 0) {
//       res.status(200).send({
//         msg: "Project Detials",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: " Not Found",
//       });
//     }
//   })
// );
// dashboardRouter.get(
//   "/dashboard",
//   expressAsyncHandler(async (req, res) => {
//     const result = await dashboardServices.dashboard();
//     if (result.length != 0) {
//       res.status(200).send({
//         msg: "Project Detials",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: " Not Found",
//       });
//     }
//   })
// );
// dashboardRouter.delete(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     const { projectId } = req.body;
//     const result = await dashboardServices.deleteOne(projectId);
//     if (result) {
//       res.status(200).send({
//         msg: "Project Deleted",
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         msge: "Project Not Deleted",
//       });
//     }
//   })
// );

