const http = require("http");
const { createReadStream, readFile, promises } = require("fs");
const { join, extname } = require("path");
const fileType = require("file-type");
const url = require("url");
const { parse } = require("querystring");

const allowedContentTypes = [
  "application/x-www-form-urlencoded",
  "application/json",
];

const messages = [
  {
    author: 'Vlad',
    message: 'Text'
  }
];
let counter = 0;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  req.url = parsedUrl.pathname;


  const full_path = join(__dirname, "assets","client.js");
  console.log(full_path)
  try {
    const stat = await promises.stat(full_path);
    if (stat.isFile()) {
      const rs = createReadStream(full_path);
      rs.once("readable", async () => {
        const chunk = rs.read(stat.size > 4100 ? 4100 : stat.size);
        const ft = await fileType.fromBuffer(chunk);
        console.log("file type", ft);
        response.setHeader(
          "content-type",
          ft ? ft.mime : `text/${extname(full_path).replace(".", "")}`
        );
        response.write(chunk);
        rs.pipe(response);
      });
      return;
    }
  } catch (e) {
    if (e.code !== "ENOENT") {
      response.statusCode = 400;
      response.end(JSON.stringify({ error: e }));
    }
  }



  if (req.method === "GET") {
    if (req.url === "/") {
      res.setHeader('Content-Type', 'text/html');
      res.write(`
        <html>
          <head>
            <title>Main page</title>
          </head>
          <body>
            <h1>Main</h1>
          </body>
        </html>
      `)
      res.end()
    } else if (req.url === "/messages") {
      res.setHeader("Content-Type", "application/json");
      const responseData = parsedUrl.query.limit
        ? messages.splice(0, parsedUrl.query.limit)
        : messages;
      res.end(JSON.stringify(responseData));
    } else {
      res.end("404");
    }
  }


  res.end("");
});

server.listen(3000, "127.0.0.1", () => {
  const address = server.address();
  console.log(`Web server started on port: ${address.port}`);
});
