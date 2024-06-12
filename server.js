import express from "express";
import "dotenv/config";
import staticRoutes from "./routes/static.js";
import routes from "./routes/index.js";
import expressLayouts from "express-ejs-layouts";
import { errorResponder, pgSession } from "./utils/index.js";
import connectFlash from "connect-flash";
import expressMessages from "express-messages";
import bodyParser from "body-parser";

const app = express();

app.use(pgSession());
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(staticRoutes);
app.use(routes);

app.use(errorResponder);

const port = process.env.PORT;
const host = process.env.HOST;

const server = app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

// gracefully shutdown if nodemon restarts, nodemon keeps failing to close the server before attempting to restart
process.once("SIGUSR2", function () {
  console.log("received a restart from nodemon, closing express server...");
  server.close(() => {
    console.log("server closed");
  });
});
