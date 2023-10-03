const coap = require('coap');

test_light();
test_switch();

// Tests for light
async function test_light(){
    request({testname:'/light/on', pathname: '/light/on', method: 'post'});
    request({testname:'/light/off', pathname: '/light/off', method: 'post'});
    request({testname:'/light/toggle', pathname: '/light/toggle', method: 'post'});
    request({testname:'/light/incorrect', pathname: '/light/incorrect', method: 'post'});
    request({testname:'/light/incorrect', pathname: '/light/incorrect', method: 'get'});
    request({testname:'/light/status', pathname: '/light/status', method: 'post'});
    request({testname:'/light/status', pathname: '/light/status', method: 'get'});
}

// Tests for switch
async function test_switch(){
    request({testname: '/switch/status', pathname: '/switch/status', method: 'get'});
}

async function request({testname = 'test', hostname = '::1', pathname = '/', method = 'get', observe = false}) {
    const req = coap.request({
        hostname: '::1',
        observe: observe,
        pathname: pathname,
        method: method,
    });
    
    req.on('response', (res) => {
        console.log(method + ' ' + testname);
        console.log('\t' + res.code);
        console.log('\t' + String(res.payload));
    });
    
    req.end();
}