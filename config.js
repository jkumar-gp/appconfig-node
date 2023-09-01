'use strict';
const axios = require('axios');

async function getLocalConfig() {
  let appconfigPort = 2772;
  try {

    const url = `http://localhost:${appconfigPort}`
              + `/applications/${process.env.APPCONFIG_APPLICATION}`
              + `/environments/${process.env.APPCONFIG_ENVIRONMENT}`
              + `/configurations/${process.env.APPCONFIG_CONFIGURATION}`;
    const response = await axios.get(url);
    
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


async function getGlobalConfig() {
    let appconfigPort = 2772;
    try {
   
      const url = `http://localhost:${appconfigPort}`
                + `/applications/${process.env.APPCONFIG_APPLICATION}`
                + `/environments/${process.env.APPCONFIG_ENVIRONMENT}`
                + `/configurations/${process.env.APPCONFIG_GLOBAL_CONFIGURATION}`;
      const response = await axios.get(url);
      
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


module.exports = {
    local: getLocalConfig,
    global: getGlobalConfig
  };