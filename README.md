# Remote Titan
Control your Linux shell remotely via the web.

## CRITICAL WARNING!
Before you do so, make sure you have the port `4000` unused, otherwise run the following command with your desired port.
```sh
$ ts-node src/index.ts -p ENTER_PORT
```
Or seek help.
```sh
$ ts-node src/index.ts -h
```

And make sure to go to your computer settings and let your local IP accessible to other devices in your network.

These images are taken from a Chromebook running Crostini Linux.
![](https://github.com/cryptosbyte/RemoteTitan/blob/main/images/crostini/Step%201.png)  
![](https://github.com/cryptosbyte/RemoteTitan/blob/main/images/crostini/Step%202.png)  
![](https://github.com/cryptosbyte/RemoteTitan/blob/main/images/crostini/Step%203.png)  

## How To Run
Just execute the following command...
```sh
$ npm start
```