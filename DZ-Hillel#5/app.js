const express = require("express");
const { join } = require("path");
const bodyParser = require("body-parser");
const messages_module = require("./messages_module");
const images_module = require("./images_module");

const server = express();
server.set('views', './assets')
server.set('view engine', 'ejs');

server.use(express.static(join(__dirname, "assets")));
server.use(express.static(join(__dirname, "public")));

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

server.locals.messages = [];

server.use(messages_module);

server.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "localhost", () => {
  console.log(`Server started on port ${PORT}`);
});