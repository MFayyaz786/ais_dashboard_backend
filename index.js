const cron = require("node-cron");
const express = require("express");
const projectDetailRouter = require("./routes/projectRouter");
const app = express();
require("./db/connection");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan")
// routes
const clientRouter = require("./routes/clientRouter");
const projectRouter = require("./routes/projectRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const versionRouter = require("./routes/versionRouter");
const sprintRouter = require("./routes/sprintRouter");
const userRouter = require("./routes/userRouter");
// const stateRouter = require("./routes/stateRouter");
const pmoRouter = require("./routes/pmoRouter");
const gmRouter = require("./routes/gmRouter");
const settingsRouter = require("./routes/settingsRouter");
const pocRouter = require("./routes/pocRouter");
const statusRouter = require("./routes/statusRouter");
const sprintVersionLogsRouter = require("./routes/sprintVersionLogsRouter");
const PMOLogsRouter = require("./routes/PMOLogsRouter");
const sendLogs = require("./utils/sendLogs");
 const { employeeRouter } = require("./routes/employeeRouter");
const fetchDataFromAPI = require('./services/fetchDataFromAPI');
//const employeeRouter = require("./routes/employeeRouter");
const zargarUserRouter = require("./routes/zargarUserRouter");

dotenv.config();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

process.on("uncaughtException", (error) => {
  // using uncaughtException event
  // console.log(' uncaught Exception => shutting down..... ');
  console.log(error.name, error.message);
  process.exit(1); //  emidiatly exists all from all the requests
});
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/user", userRouter);
app.use("/api/client", clientRouter);
app.use("/api/project", projectRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/version", versionRouter);
app.use("/api/sprint", sprintRouter);
app.use("/api/status", statusRouter);
app.use("/api/pmo", pmoRouter);
app.use("/api/gm", gmRouter);
app.use("/api/poc", pocRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/logs", sprintVersionLogsRouter);
app.use("/api/activeLogs", PMOLogsRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/zargarUser", zargarUserRouter);





app.get("/", (req, res, next) => {
  res.status(200).send({ msg: "Welcome To AIS_DASHBOARD " });
});

//handler
app.use((req, res, next) => {
  res.status(404).send({
    msg: "Router Not Found",
  });
});

// cron.schedule('*/2 * * * *', async () => {
//   const data = await fetchDataFromAPI();
//   console.log('Fetched the Data and Entered')
// });

// Schedule the cron job to run after 3 minutes
cron.schedule("55 23 * * *", async () => {
  await sendLogs();
  await fetchDataFromAPI()
  // Place your code here to run the desired task
  console.log("Cron job running after one day");
});
// cron.schedule("*/1 * * * *", async () => {
//   await sendLogs();
//   // Place your code here to run the desired task
//   console.log("Cron job running after one minute");
// });
app.use((err, req, res, next) => {
  console.log(err);
  if (err && err.code === 11000) {
    let errorKey = Object.keys(err["keyPattern"]).toString();
    // errorKey = uc.upperCaseFirst(errorKey);
    res.status(400).send({ msg: errorKey + " already exists" });
  }
  if (err.name === "ValidationError") {
    res
      .status(400)
      .send({ msg: Object.values(err.errors).map((val) => val.message) });
  } else {
    res.status(400).send({ msg: err.message });
  }
});
app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});

// e.g database connection
process.on("unhandledRejection", (error) => {
  // it uses unhandledRejection event
  // using unhandledRejection event
  console.log(" Unhandled Rejection => shutting down..... ");
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1); //  emidiatly exists all from all the requests sending OR pending
  });
});
