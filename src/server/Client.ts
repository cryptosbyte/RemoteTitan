import WebSocket from "ws";
import Child from "./ChildProcess";

type wsResponse =
  | {
      type: "error";
      error: string;
    }
  | {
      type: "stdout" | "stderr";
      value: string;
    }
  | {
      type: "done" | "validated";
    };

type wsRequest = {
  type: "cmd" | "verify" | "keystroke";
  value: string;
};

let result: string = "";

(() => {
  const alphabet = [..."aAbBcCdDeEfFgGhHiIjJ123567890"];

  [...Array(6)].forEach(() => {
    result += alphabet[~~(Math.random() * alphabet.length)];
  });

  console.log(`Your connection code is: ${result}`);
})();

export { wsRequest, wsResponse };
export default class Client {
  validated: boolean = false;
  ws: WebSocket;
  taken = false;
  currentChild: Child | undefined;
  send = async (res: wsResponse) => {
    this.ws.send(JSON.stringify(res));
  };

  constructor(ws: WebSocket) {
    this.ws = ws;
    ws.on("message", (data) => {
      const json: wsRequest = JSON.parse(data.toString());

      if (json.type === "cmd") {
        if (this.validated) {
          if (this.taken) {
            this.send({
              type: "error",
              error: "A command is already being executed...",
            });
          } else {
            if (json.value) {
              this.taken = true;

              this.currentChild = new Child();
              this.currentChild.on("output", (data: string) => {
                this.send({
                  type: "stdout",
                  value: data,
                });
              });
              this.currentChild.on("error", (data: string) => {
                this.send({
                  type: "stderr",
                  value: data,
                });
              });
              this.currentChild.start(json.value, () => {
                this.taken = false;
                this.send({
                  type: "done",
                });
              });
            } else {
              this.send({
                type: "error",
                error: "No command sent.",
              });
            }
          }
        } else {
          this.send({
            type: "error",
            error: "Not validated.",
          });
        }
      } else if (json.type === "keystroke") {
        if (this.taken) {
          this.send({
            type: "error",
            error:
              "A command is not being executed but a keystroke has been sent!",
          });
        } else {
          const keystroke: string = json.value;
          this.currentChild?.keystroke(keystroke);
        }
      } else if (json.type === "verify") {
        if (json.value) {
          if (json.value === result) {
            this.validated = true;
            this.send({
              type: "validated",
            });
            this.send({
              type: "stdout",
              value:
                "Welcome to your terminal, your connection has been successful!",
            });
          } else {
            this.send({
              type: "error",
              error: "Invalid attempted code.",
            });
          }
        } else {
          this.send({
            type: "error",
            error: "No input given.",
          });
        };
      };
    });
  };
};