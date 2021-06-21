const test = require('basictap');
const fs = require('fs');
const path = require('path');
const http = require('http');

test('connects to docker', t => {
  t.plan(1);

  const agent = require('../')({
    host: '127.0.0.1',
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync(path.resolve(process.env.HOME, '.ssh/id_rsa'))
  });

  agent.client.on('error', error => {
    console.log(error);
    t.fail('could not connect');
  });

  const request = http.request({
    socketPath: '/var/run/docker.sock',
    path: `/v1.26/version`,
    agent
  }, function (response) {
    response.on('data', chunk => {
      const data = JSON.parse(chunk);
      t.equal(data.Platform.Name, 'Docker Engine - Community');
    })
  })

  request.on('error', console.log);

  request.end()
});
