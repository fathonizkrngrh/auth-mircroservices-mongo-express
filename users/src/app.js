const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const router = require("./routers/index")
const connectToDatabase = require("./config/db")

const { bodyParserHandler, globalErrorHandler, fourOhFiveHandler, fourOhFourHandler } = require("./utils/errors")
require("dotenv").config();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));
app.use(bodyParserHandler);

connectToDatabase()

app.use("/api", router);
app.get("*", fourOhFourHandler);
app.all("*", fourOhFiveHandler);

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  console.log("Up and running user service");
});