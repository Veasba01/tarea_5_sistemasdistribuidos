"use strict"

const getRedisClient = require('./redisDB');
const headers = require('./headersCORS');

function toJson(item, index, arr) {
  arr[index] = JSON.parse(item);
}

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const redis = await getRedisClient();
   
    let keys = [];
    let n = await redis.get('publisher_N');

    for(let i = 1; i<=n; i++)
      keys.push('publisher_'+i);

    const publishers = await redis.mGet(keys);
 
    publishers.forEach(toJson);

    return { statusCode: 200, headers, body: JSON.stringify(publishers)};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
