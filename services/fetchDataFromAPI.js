const employeeModel = require("../model/employeeModel");
const projection = require("../db/projection");
const axios = require("axios");
const mongoose = require('mongoose');

const cron = require('node-cron');
const { processData } = require('../utils/processData');

const fetchDataFromAPI = async () => {
    const response = await axios.get('http://hrms.appinsnap.com/service/api/Authentication/GetEmployeeDetails');
    console.log("API hit");

    if (response.status === 200) {
      const apiData = response.data.body; // Extract data from the "body" property
      
      const savedData = await processData(apiData);
      console.log('Data processed and saved:', savedData.body);
      return savedData; // Return the processed data
    } else {
      console.error('Error fetching data from the API:', response.status, response.statusText);
    }
  } 

module.exports = fetchDataFromAPI;
