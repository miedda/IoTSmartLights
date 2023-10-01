const coap = require('coap');

const req = coap.request({
    hostname: '::1',
    observe: false,
    pathname: '/status',
    method: 'get',
});

req.on('response', (res) => {
    msg = JSON.parse(res.payload);
    console.log(msg);
    console.log(`id: ${msg.id}`);
    console.log(`time: ${msg.time}`);
    console.log(`state: ${msg.state}`);
});

req.end();