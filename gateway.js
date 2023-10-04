// The purpose of the gateway is to handle direct COAP interface with the devices and interface with the broader system.
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

class Switch {
    constructor(id, address, port){
        this.id = id,
        this.address = address,
        this.port = port,
        this.state = false,
        this.linkedLights = [],

        // Observe for switch events
        // Subscribe to switch
        this.switchObserveRequest = coap.request({
            observe: true,
            hostname: '::1',
            pathname: '/status',
            port: 5001,
        })
        
        this.switchObserveRequest.on('response', (res) => {
            res.on('data', (data) => {
                // debugLog(data);
                const msg = JSON.parse(data);
                debugLog(`Recieved switch event ${JSON.stringify(msg)}`);
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
        
        this.switchObserveRequest.end()

    }

    linkLight(light){
        this.linkedLights.push(light);
    }
}


// Create light object to track light state
let light = new Light(0, '::1', 5000);
let lightSwitch = new Switch(1, '::1', 5001);
lightSwitch.linkLight(light);






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