'use strict';
async function getFeature(name, features , env) {
  let featureArray = [];
  if( !env ){
    let envConfigArray = [];
    envConfigArray.push(features)
    const jsonConfig =  envConfigArray[0][env]
    console.log(' config json :: ',jsonConfig);
    featureArray.push(jsonConfig);
  }else{
    console.log(' env is not passed :: ');
    featureArray.push(features);
  }

 
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

module.exports = getFeature;