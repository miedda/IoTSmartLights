import 'dotenv/config';
import coap from 'coap';

test_light();
test_switch();

// Tests for light
function test_light(){
    let port = parseInt(process.env.LIGHT_PORT);
    request({testname:'Light Test 1', pathname: '/on', method: 'post', port: port});
    request({testname:'Light Test 2', pathname: '/off', method: 'post', port: port});
    request({testname:'Light Test 3', pathname: '/toggle', method: 'post', port: port});
    request({testname:'Light Test 4', pathname: '/incorrect', method: 'post', port: port});
    request({testname:'Light Test 5', pathname: '/incorrect', method: 'get', port: port});
    request({testname:'Light Test 6', pathname: '/status', method: 'post', port: port});
    request({testname:'Light Test 7', pathname: '/status', method: 'get', port: port});
}

// Tests for switch
function test_switch(){
    let port = parseInt(process.env.SWITCH_PORT);
    // request({testname: 'Switch Test 1', pathname: '/status', method: 'get', port: port});
    // request({testname: 'Switch Test 2', pathname: '/incorrect', method: 'get', port: port});
    // request({testname: 'Switch Test 3', pathname: '/incorrect', method: 'post', port: port});
    request({testname: 'Switch Test 4', pathname: '/status', method: 'get', port: port, observe: true, observeCallback: (data)=>{console.log(JSON.parse(data))}});
}

function request({testname = 'test', hostname = '::1', port = 5000, pathname = '/', method = 'get', observe = false, observeCallback = null}) {
    const req = coap.request({
        hostname: hostname,
        port: port,
        observe: observe,
        pathname: pathname,
        method: method,
    });

    req.on('response', (res) => {
        if(observe){
            console.log('observing');
            res.on('data', observeCallback);
        } else {
            console.log(testname + ' | ' + method + ' ' + pathname);
            console.log('\t' + res.code);
            console.log('\t' + String(res.payload));
        }
    });

    
    req.end();
}