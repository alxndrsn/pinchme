// Original source: https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/

const net = require('net');
const { exec } = require('child_process');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000; // probably set by foreman

process.env.ELECTRON_START_URL = `http://localhost:${port}`;
process.env.SHOW_DEV_TOOLS = true;

const client = new net.Socket();

let startedElectron = false;
function tryConnection() {
  client.connect({ port }, () => {
    client.end();

    if(startedElectron) return;

    startedElectron = true;
    exec('yarn electron');
  });
}

tryConnection();

client.on('error', () => setTimeout(tryConnection, 1000));
