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
    const id = event.path.split("/").reverse()[0];
    const redis = await getRedisClient();

    const publisher = await redis.get('publisher_'+id);
    let publishers = [];
    publishers.push(publisher);
    publishers.forEach(toJson);

    return { statusCode: 200, headers, body: JSON.stringify(publishers)};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
