import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authServer from "auth-server-jwt";
import morgan from "morgan";
import httpError from "http-errors";
import routes from "./routes";
import errorHandler from "./middleware/ErrorHandler";
import config from "./config/app";
import configToken from "./config/token";

const app = express();

const morganFormat = config.isDev ? "dev" : "combined";
app.use(morgan(morganFormat));

mongoose
  .connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000', // to allow cross origin. you can avoid this if you are running both instance on same server.
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
}
app.use(cors(corsOptions));

app.use(authServer(configToken.secretAccess));

app.use("/api", ...routes);

app.use((req, res, next) => {
  next(httpError(404));
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server started ${config.host}:${config.port}`);
});
