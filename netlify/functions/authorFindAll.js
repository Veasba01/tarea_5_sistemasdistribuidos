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
    let n = await redis.get('author_N');

    for(let i = 1; i<=n; i++)
      keys.push('author_'+i);

    const authors = await redis.mGet(keys);
 
    authors.forEach(toJson);

    return { statusCode: 200, headers, body: JSON.stringify(authors)};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
