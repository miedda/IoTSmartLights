// The purpose of the gateway is to handle direct COAP interface with the devices and interface with the broader system.

// Be able to observe the status of lights and switches


import 'dotenv/config';
import coap from 'coap';
import {debugLog} from './util.js';

class Light {
    constructor(id, address, port){
        this.id = id;
        this.address = address;
        this.port = port;
        this.state = false;
    }
    // request({testname:'Light Test 1', pathname: '/on', method: 'post', port: port});
    // request({testname:'Light Test 2', pathname: '/off', method: 'post', port: port});

    on(){
        debugLog(`Turn on light: ${this.id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/on'})
        req.on('response', (res) => {
            console.log('\t' + res.code);
            console.log('\t' + String(res.payload));
        });
        req.end();
    }

    off(){
        debugLog(`Turn off light: ${this.id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/off'})
        req.on('response', (res) => {
            console.log('\t' + res.code);
            console.log('\t' + String(res.payload));
        });
        req.end();
    }
}

let light = new Light(0, '::1', 5000);
// light.on();
// setTimeout(()=>{light.off()}, 5000);

const switchObserveRequest = coap.request({
    observe: true,
    hostname: '::1',
    pathname: '/status',
    port: 5001,
})

switchObserveRequest.on('response', (res) => {
    res.on('data', (data) => {
        // debugLog(data);
        const msg = JSON.parse(data);
        debugLog(`Recieved switch event ${JSON.stringify(msg)}`);
        if(msg.state) {light.on();}
        else {light.off();}
    })
})

switchObserveRequest.end()





class LightGroup {
    constructor(id){
        this.id = id;
        this.lights = [];
        this.state = false;
    }

    on(){
        // iterate through lights in group and turn them on
        debugLog(`Turn on light group: ${this.id}`);
        // for each light, turn on. (multicast could be considered, but better to keep the processing at higher layers)

        // for (light in this.lights){
        //     light.on();
        // }
    }

    off(){
        // iterate through lights in group and turn them off
        debugLog(`Turn on light group: ${this.id}`);
    }

    addLight(light){
        // Add a light to the list and set the lights state to match the group.
    }

    removeLight(id){
        // Remove a light from the group. No change to its state.
    }
}










// function request({testname = 'test', hostname = '::1', port = 5000, pathname = '/', method = 'get', observe = false}) {
//     const req = coap.request({
//         hostname: hostname,
//         port: port,
//         observe: observe,
//         pathname: pathname,
//         method: method,
//     });
    
//     req.on('response', (res) => {
//         console.log(testname + ' | ' + method + ' ' + pathname);
//         console.log('\t' + res.code);
//         console.log('\t' + String(res.payload));
//     });
    
//     req.end();
// }

