const Client = require('ssh2').Client;
const http = require('http');

function createConnection (client, agent, options) {
  return (_, callback) => {
    client.on('ready', function () {
      client.exec('docker system dial-stdio', function (error, stream) {
        if (error) {
          client.end();
          agent.destroy();
          return;
        }

        callback(null, stream);

        stream.on('close', () => {
          client.end();
          agent.destroy();
        });
      });
    });

    client.on('end', () => {
      agent.destroy();
    });

    client.connect(options);
  };
}

function dockerSshHttpAgent (options) {
  const client = new Client();
  const agent = new http.Agent();
  agent.createConnection = createConnection(client, agent, options);
  return agent;
}

module.exports = dockerSshHttpAgent;
