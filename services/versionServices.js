const versionModel = require("../model/versionModel");
const projectModel = require("../model/projectModel");
const projection = require("../db/projection");
const { findById } = require("../model/projectModel");
const SprintVersionLogsModel = require("../model/sprintVersionLogs");

const versionServices = {
  addNew: async (
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
  ) => {
    const data = new versionModel({
      title,
      description,
      noOfResources,
      estimatedHours,
      startDate,
      endDate,
      employees,
      createdBy,
      isKanban,
      active: status,
      actualDate,
      reason,
    });
    // add version id to project
    const updateProject = await projectModel.findById(project);
    updateProject.versions.unshift(data._id);

    const result = await data.save();
    if (result) {
      const logs = new SprintVersionLogsModel({
        project: project,
        createdBy,
        isKanban,
        sprint: null,
        version: result,
      });
      await logs.save();
    }
    updateProject.save();

    return result;
  },

  get: async () => {
    const result = await versionModel
      .find({}, projection.projection)
      .populate("employees");
    return result;
  },

  getSingle: async (id) => {
    const result = await versionModel.findById(id).populate("employees");
    return result;
  },

  update: async (body, id) => {
    const {
      projectId,
      isKanban,
      updatedBy,
      title,
      description,
      noOfResources,
      estimatedHours,
      startDate,
      endDate,
      employees,
      status,
      actualDate,
      reason,
    } = body;
    const existingDoc = await versionModel.findOne({ _id: id });
    const result = await versionModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        noOfResources,
        estimatedHours,
        startDate,
        endDate,
        employees,
        active: status,
        actualDate,
        reason,
      },
      { runValidators: true, new: true }
    );
    console.log(result, existingDoc);
    if (result && result.endDate && existingDoc.endDate) {
      if (
        result.endDate.toLocaleDateString() !==
        existingDoc.endDate.toLocaleDateString()
      ) {
        console.log("hello");
        const logs = new SprintVersionLogsModel({
          project: projectId,
          updatedBy,
          isKanban,
          sprint: null,
          version: result,
        });
        await logs.save();
      }
    }
    return result;
  },

  addNewEmployees: async (employees, id) => {
    const result = await versionModel.findOneAndUpdate(
      { _id: id },
      { employees: employees },
      { upsert: true, new: true }
    );
    return result;
  },
  removeEmployees: async (employee, id) => {
    const result = await versionModel.findOneAndUpdate(
      { _id: id },
      { $pull: { employees: employee } },
      { upsert: true, new: true }
    );
    return result;
  },
  delete: async (id) => {
    const result = await versionModel.findByIdAndDelete(id);
    return result;
  },
};
module.exports = versionServices;
