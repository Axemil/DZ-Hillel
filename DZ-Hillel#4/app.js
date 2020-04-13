const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require('url')

const server = http.createServer((req, res) => {

  const contentType = req.headers["content-type"];
  
  if(req.method === "GET"){

  }else if(req.method === "POST"){
    
  }


  // if (req.method === "GET") {
  //   if (req.url === "/") {
  //     response.write(`
  //     <html>
  //       <head>
  //         <title>Main</title>
  //       </head>
  //       <body>
  //         <h1>Main page</h1>
  //         <p>Current time: ${new Date().toISOString()}</p>
  //       </body>
  //     </html>
  //   `);
  //   } else if (req.url === "/messages") {
  //     res.setHeader("Content-Type", "application/json");
  //     const responseData = parsedUrl.query.limit
  //       ? messages.splice(0, parsedUrl.query.limit)
  //       : messages;
  //     res.end(JSON.stringify(responseData));
  //   } else {
  //     res.end("404");
  //   }
  // } else if (
  //   req.method === "POST" &&
  //   allowedContentTypes.includes(contentType)
  // ) {
  //   if (req.url === "/messages") {
  //     let message = "";
  //     req.on("data", (ch) => {
  //       message += ch;
  //     });
  //     req.on("end", () => {
  //       if (contentType === "application/x-www-form-urlencoded") {
  //         message = parse(message);
  //       } else if (contentType === "application/json") {
  //         message = JSON.parse(message);
  //       }
  //       // TODO: validation - 400
  //       message = { ...message, _id: counter++, addedAt: new Date() };
  //       messages.push(message);
  //       res.end(JSON.stringify(message));
  //     });
  //   }
  // } else {
  //   res.end("404");
  // }

});

server.listen(3000, "127.0.0.1", () => {
  const address = server.address();
  console.log(`Web server started on port: ${address.port}`);
});
