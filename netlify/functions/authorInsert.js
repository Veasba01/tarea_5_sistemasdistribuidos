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
   
    let n = await redis.get('author_N');
    n = parseInt(n) + 1;
   
    await redis.set('author_'+n, event.body);
    await redis.set('author_N', n.toString());
   
    return { statusCode: 200, headers, body: 'OK'};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
