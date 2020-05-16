const http = require("http");
const fs = require("fs");
const path = require("path");
const { parse } = require("querystring");
const url = require("url");

const allowedContentTypes = [
  "application/x-www-form-urlencoded",
  "application/json"
];

const messages = [];
let counter = 0;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const parsedUrlLength = parsedUrl.pathname.length;
  req.url =
    parsedUrlLength >= 1 && parsedUrl.pathname[parsedUrlLength - 1] === "/"
      ? parsedUrl.pathname.slice(0, parsedUrlLength - 1)
      : parsedUrl.pathname;
  const contentType = req.headers["content-type"];
  if (req.method === "GET") {
    if (req.url === "/") {
      
      const rs = fs.createReadStream(path.join(__dirname, "index.html"));
      rs.pipe(res);
    } else if (req.url === "/messages") {
      res.setHeader("Content-Type", "application/json");
      const responseData = parsedUrl.query.limit
        ? messages.splice(0, parsedUrl.query.limit)
        : messages;
      res.end(JSON.stringify(responseData));
    } else {
      res.end("404");
    }
  } else if (
    req.method === "POST" &&
    allowedContentTypes.includes(contentType)
  ) {
    if (req.url === "/messages") {
      let message = "";
      req.on("data", ch => {
        message += ch;
      });
      req.on("end", () => {
        if (contentType === "application/x-www-form-urlencoded") {
          message = parse(message);
        } else if (contentType === "application/json") {
          message = JSON.parse(message);
        }
        // TODO: validation - 400
        message = { ...message, _id: counter++, addedAt: new Date() };
        messages.push(message);
        res.end(JSON.stringify(message));
      });
    }
  } else {
    res.end("404");
  }
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server started on port 3000");
});
