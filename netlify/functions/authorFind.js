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

    const author = await redis.get('author_'+id);
    let authors = [];
    authors.push(author);
    authors.forEach(toJson);

    return { statusCode: 200, headers, body: JSON.stringify(authors)};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
