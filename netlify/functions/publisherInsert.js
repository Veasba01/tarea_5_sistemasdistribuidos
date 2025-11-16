"use strict"

const getRedisClient = require('./redisDB');
const headers = require('./headersCORS');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const redis = await getRedisClient();
    const data = JSON.parse(event.body);
   
    let n = await redis.get('publisher_N');
    n = parseInt(n) + 1;
   
    await redis.set('publisher_'+n, event.body);
    await redis.set('publisher_N', n.toString());
   
    return { statusCode: 200, headers, body: 'OK'};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
