const mongoose = require("mongoose");
require("./cache");

const MONGO_URI = "mongodb://mongo:27017/mydatabase";

async function connectMongo() {
  const conn = await mongoose.connect(MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = {
  connectMongo,
};
