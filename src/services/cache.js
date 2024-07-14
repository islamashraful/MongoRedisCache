const redis = require("redis");
const mongoose = require("mongoose");

const exec = mongoose.Query.prototype.exec;

let redisClient;

async function getRedisClient() {
  if (redisClient) return;

  return redis
    .createClient({
      url: "redis://redis:6379",
    })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "default");

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  if (!redisClient) {
    redisClient = await getRedisClient();
  }

  const redisKey = JSON.stringify({
    ...this.getQuery(),
    ...{ collection: this.mongooseCollection.name },
  });

  const cachedValue = await redisClient.hGet(this.hashKey, redisKey);
  if (cachedValue) {
    console.log("serving from cache");
    const doc = JSON.parse(cachedValue);

    return Array.isArray
      ? doc.map((item) => new this.model(item))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  console.log("serving from DB");
  redisClient.hSet(this.hashKey, redisKey, JSON.stringify(result));
  return result;
};

module.exports = {
  async clearCache(hashKey) {
    if (!redisClient) {
      redisClient = await getRedisClient();
    }

    redisClient.del(JSON.stringify(hashKey));
  },
};
