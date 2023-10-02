const startTime = Date.now();
const coap = require('coap');
const server = coap.createServer({type: 'udp6'});

server.on('request', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // res.end(req.url.split('/')[1] + '\n');
    const time = Date.now()
    const status = {"id": 0, "time": time, "state": true, "uptime": time - startTime};
    res.end(JSON.stringify(status));
});

server.listen(() => {
    console.log('server started')
})

