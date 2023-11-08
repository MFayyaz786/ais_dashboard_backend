const { default: mongoose } = require("mongoose");
const PMOLogsModel = require("../model/PMOLogsModel");
const moment = require('moment');
const PMOLogsServices = {
  getAll: async (fromDate,toDate) => {
             fromDate = moment(fromDate)
               .tz("Asia/Karachi")
               .format("YYYY-MM-DDTHH:mm:ssZ");
             toDate= moment(toDate).tz("Asia/Karachi").endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");

// const fromDate = moment('2023-07-11').startOf('day'); // Replace '2023-07-10' with your desired start date
// const toDate = moment('2023-07-11').endOf('day');
      // fromDate = new Date(fromDate).toLocaleDateString(); // Example: from date
      // toDate = new Date(toDate).toLocaleDateString();
    // toDate.setHours(23, 59, 59, 999);
     console.log("new",fromDate, toDate);
    let result = await PMOLogsModel.find({$and: [
    { loginTime: { $gte:fromDate, $lte: toDate } },
    { logoutTime: { $gte: fromDate, $lte:toDate } }
  ]}).populate({ path: "pmo" }).lean();
    if (result.length !== 0) {
      result = result.map((item) => {
        if (item.activeTime) {
          const formattedActiveTime = formatActiveTime(item.activeTime);
          return { ...item, activeTime: formattedActiveTime };
        } else {
          return { ...item, activeTime: "0 hours, 0 minutes, 0 seconds" };
        }
      });
    }
    console.log(result)
    return result;
  },
  getByPMO: async (id,fromDate,toDate) => {
     fromDate = moment(fromDate)
       .tz("Asia/Karachi")
       .format("YYYY-MM-DDTHH:mm:ssZ");
     toDate = moment(toDate)
       .tz("Asia/Karachi")
       .endOf("day")
       .format("YYYY-MM-DDTHH:mm:ssZ");
    let result = await PMOLogsModel.find({$and: [
    { loginTime: { $gte:fromDate, $lte: toDate } },
    { logoutTime: { $gte: fromDate, $lte:toDate } },
    {pmo:{$eq: id}}
  ] })
      .populate({ path: "pmo" })
      .lean();
    if (result.length !== 0) {
      result = result.map((item) => {
        if (item.activeTime) {
          const formattedActiveTime = formatActiveTime(item.activeTime);
          return { ...item, activeTime: formattedActiveTime };
        } else {
          return { ...item, activeTime: "0 hours, 0 minutes, 0 seconds" };
        }
      });
    }
    return result;
  },
  DailyActiveLogs:async(fromDate,toDate)=>{
    fromDate = moment(fromDate)
    .tz("Asia/Karachi")
    .format("YYYY-MM-DDTHH:mm:ssZ");
    toDate = moment(toDate)
    .tz("Asia/Karachi")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ssZ");
    console.log(fromDate,toDate);
    const result = await PMOLogsModel.aggregate([
      {
        $match: {
          $and: [
            { loginTime: { $gte: fromDate, $lte: toDate } },
            { logoutTime: { $gte: fromDate, $lte: toDate } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "pmo",
          foreignField: "_id",
          as: "pmo",
        },
      },
      {
        $unwind: {
          path: "$pmo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$pmo",
          activeTime: {
            $sum: "$activeTime",
          },
        },
      },
    ]);
   if (result.length !== 0) {
     for (let i = 0; i < result.length; i++) {
       if (
         result[i].activeTime !== undefined &&
         result[i].activeTime !== null &&
          result[i].activeTime !== 0
       ) {
         result[i].activeTime = formatActiveTime(result[i].activeTime);
       } else {
         result[i].activeTime = "0 hours, 0 minutes, 0 seconds";
       }
     }
   }
return result;
  },
  getOne: async (id) => {
    let result = await PMOLogsModel.findOne({ sessionId: id })
      .populate({ path: "pmo" })
      .lean();
    if (result) {
        if (result.activeTime) {
          const formattedActiveTime = formatActiveTime(result.activeTime);
          result.activeTime=formattedActiveTime
          return result;
        } else {
            result.activeTime="0 hours, 0 minutes, 0 seconds"
          return result;
        }
    }
    return result;
  },
};
function formatActiveTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
}


module.exports = PMOLogsServices;
