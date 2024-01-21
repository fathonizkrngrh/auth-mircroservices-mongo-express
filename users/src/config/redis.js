"use strict"
require('dotenv').config()

const rPort   = process.env.REDIS_PORT
const rHost   = process.env.REDIS_HOST
const rUrl    = process.env.REDIS_URL
const redis   = require('redis')
// const chalk   = require('chalk')
const client  = rUrl ? 
    redis.createClient({url: rUrl}) : 
    redis.createClient({
        socket: { port: rPort, host: rHost}
    })
console.log(rHost, rPort, rUrl)
client.connect()
client.on('connect', () => { console.log(`** Redis client connected on ${rPort} **`) })
client.on('error',  err => { console.log(`** Something went wrong: ${err}`) })
client.on('ready', () => { console.log('Redis is ready')})
client.on('end', () => { console.log('Redis connection ended')})


module.exports = client
