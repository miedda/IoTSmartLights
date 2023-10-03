const coap = require('coap');

// Tests for light
request({pathname: '/on', method: 'post'});
request({pathname: '/off', method: 'post'});
request({pathname: '/toggle', method: 'post'});
request({pathname: '/incorrect', method: 'post'});
request({pathname: '/incorrect', method: 'get'});
request({pathname: '/status', method: 'get'});

// Tests for 






function request({hostname = '::1', pathname = '/', method = 'get', observe = false}) {
    const req = coap.request({
        hostname: '::1',
        observe: observe,
        pathname: pathname,
        method: method,
    });
    
    req.on('response', (res) => {
        console.log(res.code);
        console.log(String(res.payload));
    });
    
    req.end();
}