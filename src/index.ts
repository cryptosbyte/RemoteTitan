const { version } = require("../package.json");
const { start_server } = require("./server/server");
const args = process.argv.slice(2);

(() => {
  let port = 4000;

  switch (args[0]) {
    case "-v":
    case "--version":
      console.log(`version: ${version}`);
      break;

    case "-p":
    case "--port":
      if (!args[1]) {
        console.log("port was not given!");
        process.exit(1);
      } else {
        if (!parseInt(args[1])) {
          console.log("input is not a valid int!");
          process.exit(1);
        }
        if (parseInt(args[1]) <= 65535) {
          port = parseInt(args[1]);
        }
      }
      break;

    case "--help":
    case "-h":
      console.log(
        `RemoteTitan@${version}\n usage: index.js [-h] [-v] [-p PORT (int)]\n\nControl your Linux machine over the web, remotely.\n\noptional arguments:\n\t-h, --help\t\tshows the help message\n\t-v, --version\t\tshows the program's version\n\t-p PORT, --port PORT\t\tchange the hosting port`
      );
      break;

    default:
      break;
  }

  start_server(port);
})();
