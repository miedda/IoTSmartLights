// The purpose of the gateway is to handle direct COAP interface with the devices and interface with the broader system.
import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';
import express from 'express';

class Light {
    constructor(id, address, port){
        this.id = id;
        this.address = address;
        this.port = port;
        this.state = false;
    }

    on(){
        debugLog(`Turn on light ${this.id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/on'})
        req.on('response', (res) => {
            console.log('\t' + res.code);
            console.log('\t' + String(res.payload));
            return res;
        });
        req.end();
    }

    off(){
        debugLog(`Turn off light ${this.id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/off'})
        req.on('response', (res) => {
            console.log('\t' + res.code);
            console.log('\t' + String(res.payload));
            return res;
        });
        req.end();
    }
}

class Switch {
    constructor(id, address, port){
        this.id = id,
        this.address = address,
        this.port = port,
        this.state = false,
        this.linkedLights = [],

        // Observe for switch events
        this.init();
    }
    
    init(){        
        // Subscribe to switch
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
                debugLog(`Received switch event ${JSON.stringify(msg)}`);
                if(msg.state) {
                    this.linkedLights.forEach(light => {
                        light.on();
                    })
                } else {
                    this.linkedLights.forEach(light => {
                        light.off();
                    });
                }
            })
        })
        
        switchObserveRequest.end()
    }

    linkLight(light){
        this.linkedLights.push(light);
    }
}


// Create light object to track light state
let light = new Light(0, '::1', 5000);
let lightSwitch = new Switch(1, '::1', 5001);
lightSwitch.linkLight(light);

// HTTP Server
const app = express();
const port = parseInt(process.env.SERVER_PORT);


app.listen(port, () => {
    console.log(`Gateway listening on port ${port}`);
});

app.get('/ping', (req,res) => {
    // For testing connection
    res.send('ping');
});

app.get('/lights', (req, res) => {
    // Get a list of registered lights on the gateway
    // TODO - expand to list of lights
    res.send(JSON.stringify(light));
});

app.get('/switches', (req, res) => {
    // Get a list of registered switches on the gateway
    // TODO - expand to list of all switches
    res.send(JSON.stringify(lightSwitch));
});

app.post('/on/:id', (req, res) => {
    // Turn on the light with :id 
    const result = light.on();
    res.send(result);
});

app.post('/off/:id', (req, res) => {
    // Turn off the light with :id 
    const result = light.off();
    res.send(result);
});








// class LightGroup {
//     constructor(id){
//         this.id = id;
//         this.lights = [];
//         this.state = false;
//     }

//     on(){
//         // iterate through lights in group and turn them on
//         debugLog(`Turn on light group: ${this.id}`);
//         // for each light, turn on. (multicast could be considered, but better to keep the processing at higher layers)

//         // for (light in this.lights){
//         //     light.on();
//         // }
//     }

//     off(){
//         // iterate through lights in group and turn them off
//         debugLog(`Turn on light group: ${this.id}`);
//     }

//     addLight(light){
//         // Add a light to the list and set the lights state to match the group.
//     }

//     removeLight(id){
//         // Remove a light from the group. No change to its state.
//     }

// }

