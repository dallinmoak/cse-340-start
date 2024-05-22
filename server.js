import express from "express";
import "dotenv/config";
import staticRoutes from "./routes/static.js";
import routes from "./routes/index.js";
import expressLayouts from "express-ejs-layouts";

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(staticRoutes);
app.use(routes);

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
