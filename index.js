const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

//Socket
const http = require("http");

//Session setup
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session); //Local storage in mongoDB to store information about the session

const routes = require("./routes");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.debw8k4.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Success");
  })
  .catch((err) => console.log("Failed"));

app.use(
  session({
    secret: "It's a secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      uri: `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.debw8k4.mongodb.net/?retryWrites=true&w=majority`,
      collection: "session",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //1 day in milisec.
    },
  })
);

app.use("/", routes);

app.listen(process.env.PORT || 4000, function () {
  console.log(`listening on port: ${process.env.PORT || 4000}`);
});
