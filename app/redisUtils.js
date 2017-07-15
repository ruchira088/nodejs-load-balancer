const redis = require("redis")
const bluebird = require("bluebird")

bluebird.promisifyAll(redis.RedisClient.prototype)

const createClient = options => Promise.resolve(redis.createClient(options))

const setValue = client => (key, value) => client.setAsync(key, JSON.stringify(value))

const getValue = client => key => client.getAsync(key).then(JSON.parse)

module.exports = { createClient, setValue, getValue }