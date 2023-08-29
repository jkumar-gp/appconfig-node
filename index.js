//const AWS = require('aws-sdk');
const {  AppConfigDataClient, GetLatestConfigurationCommand, StartConfigurationSessionCommand } = require("@aws-sdk/client-appconfigdata");


const client = new AppConfigDataClient({ region: 'us-east-1' });


const express = require('express');
//AWS.config.update({ region: 'us-east-1' });
const app = express();
let reusableToken = "";




async function getContractorAppConfigToken(){ 

    const input = { // StartConfigurationSessionRequest
        ApplicationIdentifier: 'tsro59v',
        EnvironmentIdentifier: 'ewbsrv9',
        ConfigurationProfileIdentifier: '27qklqs',
      };
      const sessionCommand = new StartConfigurationSessionCommand(input);
      const sessionToken = await client.send(sessionCommand);
      return sessionToken.InitialConfigurationToken || "";

}
async function getContractorConfig() {
    if (!reusableToken) {
        reusableToken = await getContractorAppConfigToken();
      }
      const command = new GetLatestConfigurationCommand({
        ConfigurationToken: reusableToken,
      });
      const response = await client.send(command);
      if(response != null){
        reusableToken = response.NextPollConfigurationToken
      }
      return response.Configuration.transformToString();
} 
async function getFeature(name, features) {
    let featureArray = [];
    featureArray.push(features);
    const feature=featureArray[0][name];
    if (feature) {
      if (feature.enabled) {
        return true;
      }
    }
    if (!feature) {
    console.error(
      `There is no feature named "${name}"`,
    );
      return false;
    }
    return false;
  }


app.get('/config/:id?',async(req,res)=>{
    try {
         var configId = req.params['id'] ;
         
          var config;
          var flag;
          var configString=  await getContractorConfig();
          if(configString){
            config = JSON.parse(configString); 
           }
          if(configId){
            flag = await getFeature(configId, config);
          }
          res.json({"config " : config , configId : flag });
       } catch (error) {
        console.error('Error fetching configuration:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  

})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});