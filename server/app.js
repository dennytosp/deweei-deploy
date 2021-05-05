var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var mongoose = require("mongoose");
require("./models/adminModel");
require("./models/categoryModel");
require("./models/customerModel");
require("./models/productModel");
require("./models/userModel");
require("./models/orderModel");

// Remember 2 lines
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");
var adminRouter = require("./routes/admin");
var categoryRouter = require("./routes/category");
var productRouter = require("./routes/product");
var clientRouter = require("./routes/client");
var orderRouter = require("./routes/order");
// MONGODB=mongodb+srv://dennytosp:Ph240524276@cluster0.kemr1.mongodb.net/Shoesing
// var db = 'mongodb+srv://dennytosp:Ph240524276@cluster0.kemr1.mongodb.net/Shoesing?retryWrites=true&w=majority'
var dba = process.env.MONGODB;
// var dbM = "mongodb+srv://dennytosp:Ph240524276@cluster0.kemr1.mongodb.net/Shoesing?authSource=admin&replicaSet=atlas-reqksr-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

var secret = "mysecret";
var app = express();
var port = process.env.PORT || 3000;
app.listen(port);

mongoose
  .connect(dba, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  // mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log("DB error", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
var hbs = require("hbs");

hbs.registerHelper("soSanh", function (a, b, c) {
  return a.toString() == b.toString();
});

hbs.registerHelper("formartDate", function (a, b) {
  d = new Date(a);
  let year = d.getFullYear();
  let month =
    d.getMonth().toString().length == 1
      ? "0" + (d.getMonth() + 1)
      : d.getMonth();
  let date =
    d.getDate().toString().length == 1 ? "0" + d.getDate() : d.getDate();
  let s = year + "-" + month + "-" + date;
  return s;
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Remember 2 lines
//Kiểm tra router
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/client", clientRouter);
app.use("/order", orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
