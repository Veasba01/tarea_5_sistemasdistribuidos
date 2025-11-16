"use strict"

const getRedisClient = require('./redisDB');
const headers = require('./headersCORS');

const authors = [
  {
    "id": 1,
    "name": "Abraham Silberschatz",
    "nationality": "American",
    "birthYear": 1952
  },
  {
    "id": 2,
    "name": "Andrew S. Tanenbaum",
    "nationality": "Dutch-American",
    "birthYear": 1944
  }
];

const publishers = [
  {
    "id": 1,
    "name": "John Wiley & Sons",
    "country": "United States",
    "foundedYear": 1807
  },
  {
    "id": 2,
    "name": "Pearson Education",
    "country": "United Kingdom",
    "foundedYear": 1844
  }
];

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const redis = await getRedisClient();

   // Initialize Authors
   const nAuthors = authors.length;
   for(let i = 1; i<=nAuthors; i++)
     await redis.set('author_'+i,JSON.stringify(authors[i-1]));
   await redis.set('author_N',nAuthors.toString());
   
   // Initialize Publishers
   const nPublishers = publishers.length;
   for(let i = 1; i<=nPublishers; i++)
     await redis.set('publisher_'+i,JSON.stringify(publishers[i-1]));
   await redis.set('publisher_N',nPublishers.toString());
    
   return { statusCode: 200, headers, body: 'OK - Authors and Publishers initialized'};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
