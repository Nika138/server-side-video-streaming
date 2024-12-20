import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import videoRoutes from "./routes/videoRoutes.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/videos", videoRoutes);

app.use((req, res, next) => {
  res.status(404).send("Page not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

export default app;
