# Docker SSH HTTP Agent
Create an http agent that connects to a remote docker instance over SSH.

## Native usage
```javascript
const fs = require('fs');
const path = require('path');
const http = require('http');

const agent = require('docker-ssh-http-agent')({
  host: '192.168.1.1',
  port: 22,
  username: 'root',
  privateKey: fs.readFileSync(path.resolve(process.env.HOME, '.ssh/id_rsa'))
});

const request = http.request({
  socketPath: '/var/run/docker.sock',
  path: `/v1.26/containers/json`,
  agent
}, function (response) {
  response.on('data', chunk => {
    console.log(chunk.toString())
  })
})
request.end()
```

## 3rd Party usage (with axios)
```javascript
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const agent = require('docker-ssh-http-agent')({
  host: '192.168.1.1',
  port: 22,
  username: 'root',
  privateKey: fs.readFileSync(path.resolve(process.env.HOME, '.ssh/id_rsa'))
});

const request = axios({
  url: '/v1.26/containers/json',
  httpAgent: agent
}).then(response => {
  console.log(response.data)
});
```
