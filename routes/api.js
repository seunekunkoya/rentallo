var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var flatRouter = require("./flat");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/flat/", flatRouter);

module.exports = app;