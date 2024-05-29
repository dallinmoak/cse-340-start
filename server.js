import express from "express";
import "dotenv/config";
import staticRoutes from "./routes/static.js";
import routes from "./routes/index.js";
import expressLayouts from "express-ejs-layouts";
import utils from "./utils/index.js";

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(staticRoutes);
app.use(routes);

app.use(async (e, req, res, next) => {
  const navData = await utils.getNavData();
  console.error(`error at ${req.originalUrl}:`, e);
  res.render("errors/error", {
    title: e.status || "Server Error",
    message: e.message,
    navData,
  });
});

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
