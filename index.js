const express = require("express");
const app = express();
const PORT = 8001;
const {connectMongoDB} = require("./connect");
const urlRoute = require("./routes/url");
const staticUrl = require("./routes/staticUrl");
const userRoute = require("./routes/user");
const path = require("path");

// Connection with DB
connectMongoDB("mongodb+srv://URL-Shortener:myurlshortenerapp@cluster0.bjz00mg.mongodb.net/URL-Shortener")
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log("Error:", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

// ejs setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views/src"));

// Router
app.use("/url", urlRoute);
app.use("/", staticUrl);
app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
