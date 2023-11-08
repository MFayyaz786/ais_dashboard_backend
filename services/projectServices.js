const { default: mongoose } = require("mongoose");
const projectModel = require("../model/projectModel");
const versionModel = require("../model/versionModel");
const sprintModel = require("../model/sprintModel");
const pmoModel = require("../model/pmoModel");
const gmModel = require("../model/gmModel");
// const stateModel = require("../model/stateModel");
const projection = require("../db/projection");
const { findById } = require("../model/projectModel");
const ClientModel = require("../model/clientModel");
const {ObjectId}=require("mongoose");
const kanbanModel = require("../model/kanbanModel");
const SprintVersionLogsModel = require("../model/sprintVersionLogs");

const projectServices = {
  addNew: async (
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
  ) => {
    // project
    let result = new projectModel({
      name,
      riskFactor,
      status: new mongoose.Types.ObjectId(status),
      client,
      pmo,
      gm,
      billAble,
      isKanban,
      state,
      reason,
    });
    //if(result){
    let result2;
    let result3;
    if (result.isKanban) {
      // version
      result2 = new versionModel({
        title: version.title,
        description: sprint.description,
        noOfResources: sprint.noOfResources,
        estimatedHours: sprint.estimatedHours,
        startDate: version.startDate,
        endDate: version.endDate,
        employees: version.employees,
        active: version.status,
        actualDate:version.actualDate,
        reason:version.reason
      });
      result2 = await result2.save();
      if (result2) {
        const logs = new SprintVersionLogsModel({
          project: result._id,
          version: result2,
          isKanban: true,
          sprint: null,
          createdBy,
        });
        await logs.save();
      }
    } else {
      result2 = new versionModel({
        title: version.title,
        startDate: version.startDate,
        endDate: version.endDate,
        active: version.status,
        actualDate: version.actualDate,
        reason: version.reason,
      });
      result3 = new sprintModel({
        title: sprint.title,
        description: sprint.description,
        noOfResources: sprint.noOfResources,
        estimatedHours: sprint.estimatedHours,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        employees: sprint.employees,
        active: sprint.status,
      });
      result2.sprints.unshift(result3._id);
      await result2.save();
      await result3.save();
      if (result3) {
        const logs = new SprintVersionLogsModel({
          project: result._id,
          version: result2,
          isKanban: false,
          sprint: result3,
          createdBy,
        });
        await logs.save();
      }
    }
    // sprint
    //if(!result.isKanban){
    //  result3 = new sprintModel({
    //   title: sprint.title,
    //   description: sprint.description,
    //   noOfResources: sprint.noOfResources,
    //   estimatedHours: sprint.estimatedHours,
    //   startDate: sprint.startDate,
    //   endDate: sprint.endDate,
    //  });
    // }else{
    //    result3 = new kanbanModel({
    //     noOfResources: sprint.noOfResources,
    //     estimatedHours: sprint.estimatedHours,
    //     startDate: sprint.startDate,
    //     endDate: sprint.endDate,
    //   });
    // }
    // add projectid to pmo
    let result4 = await pmoModel.findOne({ user: pmo });
    result4.projects.unshift(result._id);

    // add projectid to gm
    let result6 = await gmModel.findById({ _id: gm });
    // console.log("result6", result6);
    result6.projects.unshift(result._id);

    result.versions.unshift(result2._id);

    // find client and add projectID
    let result5 = await ClientModel.findById({ _id: client });
    // console.log("result5", result5);
    result5.projects.unshift(result._id);

    // save
    await result.save();
    //await result2.save();
    // await result3.save();
    await result4.save();
    await result5.save();
    await result6.save();
    // }
    return result;
  },

  get: async (id) => {
    console.log("id", id);
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { pmo: { $eq: id }, state: { $ne: "Closed" } }
      : { state: { $ne: "Closed" } };
    console.log("query", query);
    let result = await projectModel
      .find(query, projection.projection)
      .populate({
        path: "status",
      })
      .populate({
        path: "client",
      })
      .populate({
        path: "pmo",
      })
      .populate({
        path: "gm",
      })
      .populate({
        path: "versions",
        populate: [
          { path: "employees" }, // Populate employees field inside versions
          {
            path: "sprints",
            populate: { path: "employees" }, // Populate employees field inside sprints
          },
        ],
      })
      .lean();
if (result.length !== 0) {
  console.log("result: ", result);
  result = result.map((item) => {
    if (item.pmo) {
      const { firstName, lastName } = item.pmo;
      if (firstName && lastName) {
        item.pmo.name = firstName.concat(" ", lastName);
      } else if (firstName) {
        item.pmo.name = firstName;
      } else if (lastName) {
        item.pmo.name = lastName;
      }
      delete item.pmo.firstName;
      delete item.pmo.lastName;
    }
    return item;
  });
  //.filter((item) => !!item); Filter out any falsy (null, undefined) items from the result array
}


    // await projectModel.populate(result, {path: "client"});
    // await projectModel.populate(result, {path: "pmo"});
    // await projectModel.populate(result, {path: "versions"});
    console.log(result.length);
    return result;
  },
  archivedProjects: async (id) => {
    console.log("id", id);
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { pmo: { $eq: id }, state: { $eq: "Closed" } }
      : { state: { $eq: "Closed" } };
    console.log("query", query);
    let result = await projectModel
      .find(query, projection.projection)
      .populate({
        path: "status",
      })
      .populate({
        path: "client",
      })
      .populate({
        path: "pmo",
      })
      .populate({
        path: "gm",
      })
      .populate({
        path: "versions",
        populate: [
          { path: "employees" }, // Populate employees field inside versions
          {
            path: "sprints",
            populate: { path: "employees" }, // Populate employees field inside sprints
          },
        ],
      })
      .lean();
    if (result.length !== 0) {
      console.log("result: ", result);
      result = result.map((item) => {
        if (item.pmo) {
          const { firstName, lastName } = item.pmo;
          if (firstName && lastName) {
            item.pmo.name = firstName.concat(" ", lastName);
          } else if (firstName) {
            item.pmo.name = firstName;
          } else if (lastName) {
            item.pmo.name = lastName;
          }
          delete item.pmo.firstName;
          delete item.pmo.lastName;
        }
        return item;
      });
      //.filter((item) => !!item); Filter out any falsy (null, undefined) items from the result array
    }
    // await projectModel.populate(result, {path: "client"});
    // await projectModel.populate(result, {path: "pmo"});
    // await projectModel.populate(result, {path: "versions"});
    console.log(result.length);
    return result;
  },

  //
  details: async (id) => {
    const result = await projectModel
      .findById(id)
      .populate({
        path: "status",
      })
      .populate({
        path: "client",
      })
      .populate({
        path: "pmo",
      })
      .populate({
        path: "gm",
      })
      .populate({
        path: "versions",
        populate: {
          path: "employees",
        },
      }).lean();
      if (result) {
        console.log("result: ", result);
          if (result.pmo) {
            const { firstName, lastName } = result.pmo;
            if (firstName && lastName) {
              result.pmo.name = firstName.concat(" ", lastName);
            } else if (firstName) {
              result.pmo.name = firstName;
            } else if (lastName) {
              result.pmo.name = lastName;
            }
            delete result.pmo.firstName;
            delete result.pmo.lastName;
          } 
      }
    return result;
  },

  // get one

  getOne: async (id) => {
    // const result = await projectModel.aggregate([
    //   {
    //     $group: {
    //       _id: "$state",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);
    let result = await projectModel
      .findById(id)
      .lean()
      .populate({
        path: "status",
      })
      .populate({
        path: "client",
      })
      .populate({
        path: "pmo",
      })
      .populate({
        path: "gm",
      })
      .populate({
        path: "versions",
        populate: [
          { path: "employees" }, // Populate employees field inside versions
          {
            path: "sprints",
            populate: { path: "employees" }, // Populate employees field inside sprints
          },
        ],
      });
    // const versions=await versionModel.find({_id:{$in:result.versions}})
    // .populate({path:"employees"})
    // .populate({path:"sprints",model:"Sprint",
    //  populate:{path:"employees",model:"Employee"}});
    // console.log(versions)
    // result.versions=versions;
    return result;
  },
  searchByPMOState: async (pmo, state) => {
    console.log("state: ", state);
    console.log("pmo: ", pmo);
    let query = {};
    if (!state) {
      query.pmo = { $eq: pmo };
    } else if (!pmo) {
      query.state = { $eq: state };
    } else {
      query.pmo = { $eq: pmo };
      query.state = { $eq: state };
      ///query={pmo:{$eq:pmo},state:{$eq:state}}
    }
    console.log("query: ", query);
    let result = await projectModel
      .find(query)
      .lean()
      .populate({
        path: "status",
      })
      .populate({
        path: "client",
      })
      .populate({
        path: "pmo",
      })
      .populate({
        path: "gm",
      })
      .populate({
        path: "versions",
        populate: [
          { path: "employees" }, // Populate employees field inside versions
          {
            path: "sprints",
            populate: { path: "employees" }, // Populate employees field inside sprints
          },
        ],
      });
      if (result.length !== 0) {
        console.log("result: ", result);
        result = result.map((item) => {
          if (item.pmo) {
            const { firstName, lastName } = item.pmo;
            if (firstName && lastName) {
              item.pmo.name = firstName.concat(" ", lastName);
            } else if (firstName) {
              item.pmo.name = firstName;
            } else if (lastName) {
              item.pmo.name = lastName;
            }
            delete item.pmo.firstName;
            delete item.pmo.lastName;
          }
          return item;
        });
        //.filter((item) => !!item); Filter out any falsy (null, undefined) items from the result array
      }
    return result;
  },
  update: async (
    _id,
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
  ) => {
    const previousProjectInfo = await projectModel.findOne({ _id });
    const result = await projectModel.findOneAndUpdate(
      { _id },
      {
        name,
        pmo,
        gm,
        riskFactor,
        client,
        billAble,
        state,
        status,
        isKanban,
        reason,
      },
      { runValidators: true, new: true }
    );

    if (result) {
      // Remove projectId from previous pmo if it has changed
      if (previousProjectInfo.pmo !== pmo) {
        await pmoModel.findOneAndUpdate(
          { user: previousProjectInfo.pmo },
          { $pull: { projects: _id } }
        );
      }

      // Remove projectId from previous gm if it has changed
      if (previousProjectInfo.gm !== gm) {
        await gmModel.findOneAndUpdate(
          { user: previousProjectInfo.gm },
          { $pull: { projects: _id } }
        );
      }
     //remove sprint from version in case of project type change from sprint to kanban
     if(previousProjectInfo.isKanban===false && result.isKanban===true){
      await versionModel.updateMany({_id:{$in:result.versions}},{sprints:[]});
     }
      // Add projectId to new pmo
      let result4 = await pmoModel.findOneAndUpdate(
        { user: pmo },
        {
          $addToSet: {
            projects: result._id,
          },
        }
      );

      // Add projectId to new gm
      let result6 = await gmModel.findOneAndUpdate(
        { _id: gm },
        {
          $addToSet: {
            projects: result._id,
          },
        }
      );
    }

    return result;
  },

  // update: async (
  //   _id,
  //   name,
  //   pmo,
  //   gm,
  //   riskFactor,
  //   client,
  //   billAble,
  //   state,
  //   status,
  //   isKanban
  // ) => {
  //   // const {
  //   //   name,
  //   //   noOfResourses,
  //   //   estimateHours,
  //   //   startDate,
  //   //   endDate,
  //   //   riskFactor,
  //   //   liveDate,
  //   //   client,
  //   //   pmo,
  //   //   gm,
  //   // } = body;
  //   // const updateVersion = {
  //   //   $addToSet: {
  //   //     projects: version._id,
  //   //   },
  //   // };
  //   const previusProjectInfo = await projectModel.findOne({ _id });
  //   const result = await projectModel.findOneAndUpdate(
  //     { _id },
  //     {
  //       name,
  //       pmo,
  //       gm,
  //       riskFactor,
  //       client,
  //       billAble,
  //       state,
  //       status,
  //       isKanban,
  //     },
  //     { runValidators: true, new: true }
  //   );
  //   // version
  //   // let result2 = await versionModel.findOneAndUpdate(
  //   //   { _id: version.id },
  //   //   {
  //   //     title: version.title,
  //   //     startDate: version.startDate,
  //   //     endDate: version.endDate,
  //   //    $addToSet: {
  //   //       sprints: sprint._id,
  //   //     },
  //   //   },
  //   //   { new: true }
  //   // );

  //   // // sprint
  //   // let result3 =await  sprintModel.findByIdAndUpdate({_id:sprint.id},{
  //   //   title: sprint.title,
  //   //   description: sprint.description,
  //   //   noOfResources: sprint.noOfResources,
  //   //   estimatedHours: sprint.estimatedHours,
  //   //   startDate: sprint.startDate,
  //   //   endDate: sprint.endDate,
  //   // },{new:true});
  //   if (result) {
  //     // // add projectId to pmo
  //     if (previusProjectInfo.pmo === pmo) {
  //       await pmoModel.findOneAndUpdate(
  //         { user: previusProjectInfo.pmo },
  //         { $pull: { projects: _id } }
  //       );
  //     }
  //     if (previusProjectInfo.gm === gm) {
  //       await gmModel.findOneAndUpdate(
  //         { user: previusProjectInfo.gm },
  //         { $pull: { projects: _id } }
  //       );
  //     }
  //     let result4 = await pmoModel.findOneAndUpdate(
  //       { user: pmo },
  //       {
  //         $addToSet: {
  //           projects: result._id,
  //         },
  //       }
  //     );
  //     //result4.projects.unshift(result._id);

  //     // // add projectid to gm
  //     let result6 = await gmModel.findOneAndUpdate(
  //       { _id: gm },
  //       {
  //         $addToSet: {
  //           projects: result._id,
  //         },
  //       }
  //     );
  //   }
  //   // console.log("result6", result6);
  //   //  result6.projects.unshift(result._id);

  //   // //result.versions.unshift(result2._id);
  //   // //result2.sprints.unshift(result3._id);

  //   // // find client and add projectID
  //   // let result5 = await ClientModel.findOneAndUpdate(
  //   //   { _id: client },
  //   //   {
  //   //     $addToSet: {
  //   //       projects: result._id,
  //   //     },
  //   //   }
  //   // );
  //   // console.log("result5", result5);
  //   // result5.projects.unshift(result._id);

  //   // save
  //   // await result.save();
  //   // await result2.save();
  //   // await result3.save();
  //   // await result4.save();
  //   // await result5.save();
  //   // await result6.save();
  //   return result;
  // },

  manageStatus: async (project, status) => {
    const result = await projectModel.findOneAndUpdate(
      { _id: project },
      {
        status: new mongoose.Types.ObjectId(status),
      },
      { runValidators: true, new: true }
    );
    return result;
  },

  manageState: async (project, state) => {
    console.log("project", project);
    console.log("state", state);

    const result = await projectModel.findOneAndUpdate(
      { _id: project },
      {
        state,
      },
      { runValidators: true, new: true }
    );
    console.log("result", result);
    return result;
  },
  isUse: async (id) => {
    const result = await projectModel.findOne({ status: id });
    return result;
  },
  delete: async (id) => {
    const result = await projectModel.findByIdAndDelete(id);
    return result;
  },
};
module.exports = projectServices;
