var nodemailer = require("nodemailer");
const PMOLogsServices = require("../services/PMOLogsServices");
const moment = require("moment");
const sendLogs = async () => {
  console.log("cron")
  var transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAILPASS,
    },
  });
  const currentDate = moment().format("YYYY-MM-DD");
  const logs=await PMOLogsServices.DailyActiveLogs(currentDate,currentDate);
  if (logs.length !== 0) {
    let emailBody = "<h2>Daily Active PMOs Report:</h2>";
    emailBody += `<p>Date: ${new Date().toLocaleDateString()}</p><br/>`;

    logs.forEach((log) => {
      emailBody += `<strong>PMO:</strong> ${log._id.firstName} ${log._id.lastName}<br/>`;
      emailBody += `<strong>Active Time:</strong> ${log.activeTime}<br/><br/>`;
    });

    var mailOptions = {
      from: process.env.MAIL,
      to: process.env.LOGSMAIL,
      subject: "Daily Active PMOs Report",
      html: emailBody, // Use "html" instead of "text" for HTML content
    };

    result = await transporter.sendMail(mailOptions);
    console.log(result);
  }
  //   if(logs.length!==0){
  //   let emailBody = "Daily Active PMOs Report:\n";
  //       emailBody +=`Date: ${new Date().toLocaleDateString()}\n\n`

  //   logs.forEach((log) => {
  //     emailBody += `PMO: ${log._id.firstName} ${log._id.lastName}\n`;
  //     emailBody += `Active Time: ${log.activeTime} \n\n`;
  //   });
  //     var mailOptions = {
  //       from: process.env.MAIL,
  //       to: process.env.LOGSMAIL,
  //       subject: "Daily Active PMOs Report",
  //       text: emailBody,
  //     };
  //     result = await transporter.sendMail(mailOptions);
  //     console.log(result)
  // }
  else {
    return;
  }
};
module.exports = sendLogs;
