const coap = require('coap');
const server = coap.createServer({type: 'udp6'});

server.on('request', (req, res) => {
    // res.end('Hello ' + req.url.split('/')[1] + '\n');
    res.
    res.type()
})

server.listen(() => {
    const req = coap.request('coap://[::1]/Test')

    req.on('response', (res) => {
        res.pipe(process.stdout);
        res.on('end', () => {
            process.exit(0);
        });
    });

    req.end();
});