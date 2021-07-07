import http from "http";
import ip from "ip";
import fs from "fs";
import Wss from "./WebsocketServer";

module.exports = {
  start_server(port: number) {
    const server = http
      .createServer((request: any, response: any) => {
        const url = request.url;

        switch (url) {
          case "/":
            fs.readFile("./public/index.html", "UTF-8", (err, html) => {
              response.writeHead(200, {
                "Content-Type": "text/html",
              });
              response.end(html);
            });
            break;

          case "/main.css":
            fs.readFile("./public/terminal.css", "UTF-8", (err, html) => {
              response.writeHead(200, {
                "Content-Type": "text/css",
              });
              response.end(html);
            });
            break;

          case "/terminal.css":
            fs.readFile("./public/main.css", "UTF-8", (err, html) => {
              response.writeHead(200, {
                "Content-Type": "text/css",
              });
              response.end(html);
            });
            break;

          default:
            response.writeHead(404);
            response.end();
            break;
        }
      })
      .listen(port, () =>
        console.log(
          `Remote Control is now on PORT ${ip.address()}:${port}!\nDon't forget to port-forward!`
        )
      );

    new Wss(server);
  },
};
