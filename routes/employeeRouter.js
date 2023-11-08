const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const employeeRouter = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const employeeServices = require("../services/employeeServices");
const employeeModel = require("../model/employeeModel");
const fetchDataFromAPI = require('../services/fetchDataFromAPI');
const { default: mongoose } = require("mongoose");
const { processData } = require('../utils/processData');
// ...

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

employeeRouter.post(
  "/upload",
  upload.single("file"),
  expressAsyncHandler(async (req, res) => {
    const filePath = req.file.path;
    // Process the uploaded file
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Extract the required data and send it back to the frontend
      const processedData = await processData(data);
      res.json({ data: processedData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  })
);
employeeRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { id, name, designation, department, vertical, status } = req.body;
    if ((!id || !name || !designation || !department || !vertical)) {
      res.status(400).send({
        msg: "Field Missing",
      });
    } else {
      const result = await employeeServices.addNew(
        id,
        name,
        designation,
        department,
        vertical,
        status
      );
      if (result) {
        res.status(200).send({
          msg: "Employee Added",
          data: result,
        });
      } else {
        res.status(400).send({
          msg: "Employee Not Added",
        });
      }
    }
  })
);
employeeRouter.patch(
  "/status/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await employeeServices.updateStatus(req.params.id, req.body.status);
    if (result) {
      res.status(200).send({
        msg: "Employee status updated",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "Employee status Not updated",
      });
    }
  })
);
employeeRouter.patch(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await employeeServices.update(req.params.id, req.body);
    if (result) {
      res.status(200).send({
        msg: "Employee profile updated",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "Employee profile Not updated",
      });
    }
  })
);
employeeRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const result = await employeeServices.get();
    res.status(200).send({
      msg: "Employee List",
      data: result,
    })
  })
);
employeeRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await employeeServices.getOne(req.params.id);
    if (result) {
      res.status(200).send({
        msg: "Employee Details",
        data: result,
      });
    } else {
      res.status(400).send({
        msg: "Employee Not Found",
      });
    }
  })
);
employeeRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const result = await employeeServices.delete(req.params.id);
    if (result) {
      res.status(200).send({
        msg: "Employee deleted",
      });
      return;
    } else {
      res.status(400).send({
        msg: "Employee Not deleted",
      });
      return;
    }
  })
);
// const processData = async ( data) => {
//   const processedData = await data.slice(1).map((row) => ({
//     fullName: row[1],
//     designation: row[2],
//     department: row[3],
//     status: row[4]
//   }));
//   const session = await mongoose.startSession();
//   let savedData;
//   try {
//     session.startTransaction();
//     savedData = await employeeModel.insertMany(processedData);
//     await session.commitTransaction();
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Transaction aborted. Error: ", error);
//     throw error;
//   } finally {
//     session.endSession();
//   }

//   return savedData;
// // };
// const processData = async (data) => {
//   console.log("data",data)
//   const processedData =await data.slice(1).map((row) => ({
//     employeeId:row[0],
//     fullName: row[1],
//     designation: row[2],
//     department: row[3],
//     status: row[4]
//   }));
// console.log("row",processData)


//   const session = await mongoose.startSession();
//   let savedData;
//   try {
//     session.startTransaction();



//     // Iterate through processedData and insert only if fullName doesn't exist in the database
//     const uniqueProcessedData = [];
//     for (const item of processedData) {
//       const existingEmployee = await employeeModel.findOne({ fullName: item.fullName });
//       if (!existingEmployee) {
//         uniqueProcessedData.push(item);
//       }
//     }



//     if (uniqueProcessedData.length > 0) {
//       savedData = await employeeModel.insertMany(uniqueProcessedData);
//     }



//     await session.commitTransaction();
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Transaction aborted. Error: ", error);
//     throw error;
//   } finally {
//     session.endSession();
//   }



//   return savedData;
// };
//////////////////////////////////////////
// const processData = async (data) => {
//   console.log('Processing data...');
//   console.log('Received data:', savedData);
//   const processedData = data.map((item) => ({
//     employeeId: item.employeeID,
//     fullName: item.fullName,
//     designation: item.designation,
//     department: item.department,
//     status: item.status
//   }));
// console.log("Process Data");
//   const session = await mongoose.startSession();
//   let savedData;
//   try {
//     session.startTransaction();

//     const fullNames = processedData.map((item) => item.fullName);

//     const existingEmployees = await employeeModel.find({ fullName: { $in: fullNames } });

//     const existingFullNamesSet = new Set(existingEmployees.map((employee) => employee.fullName));

//     const uniqueProcessedData = processedData.filter((item) => !existingFullNamesSet.has(item.fullName));

//     if (uniqueProcessedData.length > 0) {
//       savedData = await employeeModel.insertMany(uniqueProcessedData);
//     }

//     await session.commitTransaction();
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Transaction aborted. Error:", error);
//     throw error;
//   } finally {
//     session.endSession();
//   }

//   return savedData;
// };

module.exports = { employeeRouter }
