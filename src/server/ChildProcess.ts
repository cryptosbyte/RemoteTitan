import { ChildProcess, exec } from "child_process";

export default class Child {
  child: ChildProcess | undefined;

  private onFunctions: {
    output: Array<CallableFunction>;
    error: Array<CallableFunction>;
  } = {
    output: [],
    error: [],
  };

  on = (type: "output" | "error", cb: CallableFunction) => {
    if (this.child === undefined) {
      this.onFunctions[type].push(cb);
    } else {
      throw new Error(
        "Child process already started, cannot add new listener!"
      );
    }
  };
  start = async (command: string, finish?: any) => {
    this.child = exec(command, finish);
    this.child.stdout?.on("data", (data: string) => {
      this.onFunctions.output.forEach((func) => {
        func(data);
      });
    });
    this.child.stderr?.on("data", (data: string) => {
      this.onFunctions.error.forEach((func) => {
        func(data);
      });
    });
  };
  keystroke = (input: string) => {
    this.child?.stdin?.write(input);
  };
}
