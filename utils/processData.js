const mongoose = require('mongoose');
const employeeModel = require('../model/employeeModel');

const processData = async (data) => {
    console.log('Processing data...');  
    const processedData = data.map((item) => ({
      employeeId: item.employeeID,
      fullName: item.fullName,
      designation: item.designation,
      department: item.department,
      status: item.status
    }));
  
    const session = await mongoose.startSession();
    let savedData;
  
    session.startTransaction();
  
    const fullNames = processedData.map((item) => item.fullName);
  
    const existingEmployees = await employeeModel.find({ fullName: { $in: fullNames } });
  
    const existingFullNamesSet = new Set(existingEmployees.map((employee) => employee.fullName));
  
    const uniqueProcessedData = processedData.filter((item) => !existingFullNamesSet.has(item.fullName));
  
    if (uniqueProcessedData.length > 0) {
      savedData = await employeeModel.insertMany(uniqueProcessedData);
    }
  
    await session.commitTransaction();
    session.endSession();
    return savedData;
  };
  
  
module.exports = { processData };