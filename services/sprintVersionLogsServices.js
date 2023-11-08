const { default: mongoose } = require("mongoose");
const SprintVersionLogsModel = require("../model/sprintVersionLogs");

const sprintVersionLogsServices={
     getAll:async()=>{
        const result = await SprintVersionLogsModel.aggregate([
          {
            $lookup: {
              from: "settings",
              localField: "sprint.title",
              foreignField: "_id",
              as: "sprint.setting",
            },
          },
          {
            $unwind: {
              path: "$sprint.setting",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "settings",
              localField: "version.title",
              foreignField: "_id",
              as: "version.setting",
            },
          },
          {
            $unwind: {
              path: "$version.setting",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
            },
          },
          {
            $unwind: {
              path: "$createdBy",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "updatedBy",
              foreignField: "_id",
              as: "updatedBy",
            },
          },
          {
            $unwind: {
              path: "$updatedBy",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
        return result;
    },
    getByProject:async(id)=>{
        const result = await SprintVersionLogsModel.aggregate([
          {
            $match: {
              project: new mongoose.Types.ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "settings",
              localField: "sprint.title",
              foreignField: "_id",
              as: "sprint.setting",
            },
          },
          {
            $unwind: {
              path: "$sprint.setting",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "settings",
              localField: "version.title",
              foreignField: "_id",
              as: "version.setting",
            },
          },
          {
            $unwind: {
              path: "$version.setting",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
            },
          },
          {
            $unwind: {
              path: "$createdBy",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "updatedBy",
              foreignField: "_id",
              as: "updatedBy",
            },
          },
          {
            $unwind: {
              path: "$updatedBy",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
        return result
    }
}
module.exports=sprintVersionLogsServices