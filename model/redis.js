const Redis = require("ioredis");

let redisClient;

if (!global.redisClient) {
  if (process.env.REDIS_URL) {
    console.log("Connecting to Redis using REDIS_URL");
    console.log("REDIS_URL:", process.env.REDIS_URL);
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      keepAlive: 10000,
      reconnectOnError: () => true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
    module.exports = redisClient;
  } else {
    redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PW
    });
  }
  global.redisClient = redisClient;
}

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  if (err.code == "ECONNRESET" || err.code == "EPIPE") return;
  console.error("Redis Error:", err);
});

module.exports = redisClient;