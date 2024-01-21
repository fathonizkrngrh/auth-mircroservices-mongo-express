const mongoose = require("mongoose");

const APP_NAME = "FATHONI ZIKRI API";
const ENV = process.env.NODE_ENV;

async function connectToDatabase() {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://mongo:27018/fathoni-zikri-nugroho";

    console.log(MONGODB_URI);

  mongoose.Promise = Promise;
  if (ENV === "development" || ENV === "test") {
    mongoose.set("debug", true);
  }
 
  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`${APP_NAME} successfully connected to database.`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectToDatabase