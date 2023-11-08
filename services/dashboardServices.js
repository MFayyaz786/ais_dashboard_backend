const { default: mongoose } = require("mongoose");
const dashboardModel = require("../model/dashboardModel");
const projectModel = require("../model/projectModel");
const statusModel = require("../model/statusModel");
const projection = require("../db/projection");

const dashboardServices = {
  // get
  dashboard: async () => {
    const result = await projectModel.aggregate([
      {
        state: mongoose.Types.ObjectId(state),
      },
      { new: true },
    ]);
    return result;
  },
  get: async () => {
    let result = await dashboardModel
      .find({}, projection.projection)
      .populate({
        path: "state",
        select: { state: 1 },
      })
      .populate({
        path: "pmo",
        select: { PMOName: 1 },
      })
      .lean();
    if (result.length != 0) {
      result = result.map((item) => {
        item.stateId = item.state._id;
        item.pmoId = item.pmo._id;
        item.state = item.state.state;
        item.pmo = item.pmo.PMOName;
        return item;
      });
    }
    return result;
  },
  getOne: async (projectId) => {
    let result = await dashboardModel
      .findById({ _id: projectId }, projection.projection)
      .populate({
        path: "state",
        select: { state: 1, _id: 0 },
      })
      .populate({
        path: "pmo",
        select: { PMOName: 1, _id: 0 },
      })
      .lean();
    if (result) {
      result.state = result.state.state;
      result.pmo = result.pmo.PMOName;
    }

    return result;
  },
  getState: async (stateId) => {
    const result = await dashboardModel
      .find({ state: { $in: stateId } }, projection.projection)
      .populate({
        path: "state",
        select: { state: 1, _id: 0 },
      })
      .populate({
        path: "pmo",
        select: { PMOName: 1, _id: 0 },
      })
      .lean();
    result.map((item) => {
      item.state = item.state.state;
      item.pmo = item.pmo.PMOName;
      return item;
    });

    return result;
  },
  dashboard: async () => {
    const result = await projectModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    // const result=await projectModel.find()
    return result;
  },

  //   addNew: async (
  //     projectName,
  //     startDate,
  //     finishDate,
  //     estimateHours,
  //     onTrack,
  //     riskFactor,
  //     goLiveDate,
  //     currentSpirit,
  //     state,
  //     pmo
  //   ) => {
  //     const data = new dashboardModel({
  //       projectName,
  //       startDate,
  //       finishDate,
  //       estimateHours,
  //       onTrack,
  //       riskFactor,
  //       goLiveDate,
  //       currentSpirit,
  //       state: mongoose.Types.ObjectId(state),
  //       pmo: mongoose.Types.ObjectId(pmo),
  //     });
  //     const result = await data.save();
  //     return result;
  //   },
  //   update: async (
  //     projectId,
  //     projectName,
  //     startDate,
  //     finishDate,
  //     estimateHours,
  //     onTrack,
  //     riskFactor,
  //     goLiveDate,
  //     currentSpirit,
  //     state,
  //     pmo
  //   ) => {
  //     const result = await dashboardModel.findOneAndUpdate(
  //       { _id: projectId },
  //       {
  //         projectName,
  //         startDate,
  //         finishDate,
  //         estimateHours,
  //         state,
  //         onTrack,
  //         riskFactor,
  //         goLiveDate,
  //         currentSpirit,
  //         state: mongoose.Types.ObjectId(state),
  //         pmo: mongoose.Types.ObjectId(pmo),
  //       }
  //     );
  //     return result;
  //     console.log(result);
  //   },
  //   updateState: async (projectId, state) => {
  //     const result = await dashboardModel.findOneAndUpdate(
  //       { _id: projectId },
  //       {
  //         state: mongoose.Types.ObjectId(state),
  //       },
  //       { new: true }
  //     );
  //     return result;
  //   },
  //   get: async () => {
  //     let result = await dashboardModel
  //       .find({}, projection.projection)
  //       .populate({
  //         path: "state",
  //         select: { state: 1 },
  //       })
  //       .populate({
  //         path: "pmo",
  //         select: { PMOName: 1 },
  //       })
  //       .lean();
  //     if (result.length != 0) {
  //       result = result.map((item) => {
  //         item.stateId = item.state._id;
  //         item.pmoId = item.pmo._id;
  //         item.state = item.state.state;
  //         item.pmo = item.pmo.PMOName;
  //         return item;
  //       });
  //     }
  //     return result;
  //   },
  //   getOne: async (projectId) => {
  //     let result = await dashboardModel
  //       .findById({ _id: projectId }, projection.projection)
  //       .populate({
  //         path: "state",
  //         select: { state: 1, _id: 0 },
  //       })
  //       .populate({
  //         path: "pmo",
  //         select: { PMOName: 1, _id: 0 },
  //       })
  //       .lean();
  //     if (result) {
  //       result.state = result.state.state;
  //       result.pmo = result.pmo.PMOName;
  //     }

  //     return result;
  //   },
  //   getState: async (stateId) => {
  //     const result = await dashboardModel
  //       .find({ state: { $in: stateId } }, projection.projection)
  //       .populate({
  //         path: "state",
  //         select: { state: 1, _id: 0 },
  //       })
  //       .populate({
  //         path: "pmo",
  //         select: { PMOName: 1, _id: 0 },
  //       })
  //       .lean();
  //     result.map((item) => {
  //       item.state = item.state.state;
  //       item.pmo = item.pmo.PMOName;
  //       return item;
  //     });

  //     return result;
  //   },
  //   dashboard: async () => {
  //     const result = await dashboardModel
  //       .aggregate([
  //         {
  //           $group: {
  //             _id: "$state",
  //             count: { $sum: 1 },
  //           },
  //         },
  //       ])
  //       .sort({ _id: 1 });
  //     var totalProject = 0;
  //     for (var i of result) {
  //       totalProject += i.count;
  //     }
  //     for (i of result) {
  //       var stateId = i._id;
  //       var state = await statusModel.findOne(
  //         { _id: stateId },
  //         { state: 1, _id: 1 }
  //       );
  //       i.id = state._id;
  //       i.state = state.state;
  //       i.percentage = Math.floor((i.count / totalProject) * 100) + "%";
  //       delete i._id;
  //     }

  //     const total = {
  //       count: 0,
  //       state: "Total Projects",
  //       total: totalProject,
  //     };
  //     result.unshift(total);
  //     return result;
  //   },
  //   delete: async (projectId) => {
  //     const result = await dashboardModel.delete({ _id: projectId });
  //     return result;
  //   },
};
module.exports = dashboardServices;
