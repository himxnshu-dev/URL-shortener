const express = require("express");
const app = express();
const PORT = 8001;
const {connectMongoDB} = require("./connect");
const urlRoute = require("./routes/url");
const staticUrl = require("./routes/staticUrl");
const userRoute = require("./routes/user");
const path = require("path");

// Connection with DB
connectMongoDB("mongodb://127.0.0.1:27017/URL-shortener")
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log("Error:", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// ejs setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Router
app.use("/url", urlRoute);
app.use("/", staticUrl);
app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
