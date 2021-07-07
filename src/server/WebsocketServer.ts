import WebSocket from "ws";
import url from "url";
import Client from "./Client";

export default class WebSocketServer {
  httpServer;
  clients: Array<Client> = [];
  constructor(httpServer: any) {
    const wss1 = new WebSocket.Server({ noServer: true });
    const me = this;
    wss1.on("connection", function connection(ws) {
      ws.on("message", () => {
        me.clients.push(new Client(ws));
      });
    });

    httpServer.on(
      "upgrade",
      function upgrade(request: any, socket: any, head: any) {
        const pathname = url.parse(request.url).pathname;
        if (pathname === "/api/terminal") {
          wss1.handleUpgrade(request, socket, head, function done(ws) {
            wss1.emit("connection", ws, request);
          });
        } else {
          socket.destroy();
        }
      }
    );
    this.httpServer = httpServer;
  }
}
