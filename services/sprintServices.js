const sprintModel = require("../model/sprintModel");
const versionModel = require("../model/versionModel");
const projection = require("../db/projection");
const SprintVersionLogsModel = require("../model/sprintVersionLogs");
const SprintModel = require("../model/sprintModel");
const ProjectModel = require("../model/projectModel");

const sprintServices = {
  addNew: async (
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
  ) => {
    const data = new sprintModel({
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
      active:status
    });
    // add sprint id to version
    const updateVersion = await versionModel.findById(version);
    updateVersion.sprints.unshift(data._id);

    const result = await data.save();
    if (result) {
      const project = await ProjectModel.findOne({ versions: version });
      const logs = new SprintVersionLogsModel({
        project: project._id,
        createdBy,
        isKanban,
        sprint: result,
        version: version,
      });
      await logs.save();
    }
    await updateVersion.save();
    return result;
  },

  get: async () => {
    const result = await sprintModel
      .find({}, projection.projection)
      .populate("employees");
    return result;
  },

  getSingle: async (id) => {
    const result = await sprintModel.findById(id).populate("employees");
    return result;
  },

  update: async (body, id) => {
    const {
      projectId,
      updatedBy,
      isKanban,
      version,
      title,
      description,
      noOfResources,
      estimatedHours,
      startDate,
      endDate,
      employees,
      status
    } = body;
    const existingDoc = await sprintModel.findOne({ _id: id });
    const result = await sprintModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        noOfResources,
        estimatedHours,
        startDate,
        endDate,
        employees,
        active:status
      },
      { runValidators: true, new: true }
    );
    if (result && result.endDate && existingDoc.endDate) {
      if (
        result.endDate.toLocaleDateString() !==
        existingDoc.endDate.toLocaleDateString()
      ) {
        const logs = new SprintVersionLogsModel({
          project: projectId,
          updatedBy,
          isKanban,
          sprint: result,
          version: version,
        });
        await logs.save();
      }
    }
    return result;
  },
  addNewEmployees: async (employees, id) => {
    const result = await SprintModel.findOneAndUpdate(
      { _id: id },
      { employees: employees },
      { new: true }
    );
    return result;
  },
  removeEmployees: async (employee, id) => {
    const result = await SprintModel.findOneAndUpdate(
      { _id: id },
      { $pull: { employees: employee } },
      { upsert: true, new: true }
    );
    return result;
  },
  delete: async (id) => {
    const result = await sprintModel.findByIdAndDelete(id);
    return result;
  },
};
module.exports = sprintServices;
