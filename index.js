const express = require('express');
const app = express();


// this is with ecs agent
const getConfig = require('./config');
const getFeature = require('./feature');

//not needed for agent
const {  AppConfigDataClient, GetLatestConfigurationCommand, StartConfigurationSessionCommand } = require("@aws-sdk/client-appconfigdata");
const client = new AppConfigDataClient({ region: 'us-east-1' });

let reusableToken = "";




// async function getContractorAppConfigToken(){ 

//     const input = { // StartConfigurationSessionRequest
//         ApplicationIdentifier: 'tsro59v',
//         EnvironmentIdentifier: 'ewbsrv9',
//         ConfigurationProfileIdentifier: '27qklqs',
//       };
//       const sessionCommand = new StartConfigurationSessionCommand(input);
//       const sessionToken = await client.send(sessionCommand);
//       return sessionToken.InitialConfigurationToken || "";

// }
// async function getContractorConfig() {
//     if (!reusableToken) {
//         reusableToken = await getContractorAppConfigToken();
//       }
//       const command = new GetLatestConfigurationCommand({
//         ConfigurationToken: reusableToken,
//       });
//       const response = await client.send(command);
//       if(response != null){
//         reusableToken = response.NextPollConfigurationToken
//       }
//       return response.Configuration.transformToString();
// } 



// app.get('/config/:id?',async(req,res)=>{
//     try {
//          var configId = req.params['id'] ;
         
//           var config;
//           var flag;
//           var configString=  await getContractorConfig();
//           if(configString){
//             config = JSON.parse(configString); 
//            }
//           if(configId){
//             flag = await getFeature(configId, config);
//           }
        
//           res.json({"config " : config , configId : flag });

          

//        } catch (error) {
//         console.error('Error fetching configuration:', error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
  

// })

app.get('/',async(req,res)=>{

  res.send("Hello World")

});


app.get('/ecs/config/:id',async(req,res)=>{
  var configId = req.params['id'] ;

  var flag;
  try {
    if(configId){
      const localConfigString = await getConfig.local();
      flag = await getFeature(configId, localConfigString );
    }
    if(flag && configId == "isError"){
      console.error('ERROR  There is an error in the configuration', error);
    }
    console.info('successfully logged the response');
    const responseObj = {
      configId: flag,
      // Other key-value pairs if needed
    };
    res.json(JSON.stringify(responseObj));
  
  }catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 

});
app.get('/ecs/config',async(req,res)=>{
  

  var flag;
  try {
    const localConfigString = await getConfig.local();
    const globalConfigString = await getConfig.global();
    res.json({"locaConfig " : localConfigString , "globalConfig ": globalConfigString});
  }catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 

});


const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});