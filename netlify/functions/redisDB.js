"use strict";

const { createClient } = require('redis');

let client = null;

async function getClient() {
  if (!client) {
    client = createClient({
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PSW || 'OYh0XsNK66Wlv3lcSrMrhkl2PrAFiYsf',
      socket: {
        host: process.env.REDIS_HOST || 'redis-14213.c270.us-east-1-3.ec2.cloud.redislabs.com',
        port: parseInt(process.env.REDIS_PORT || '14213')
      }
    });

    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
  }
  return client;
}

module.exports = getClient;

