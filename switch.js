// This file defines a smart light that can be turned on, off or toggled via a coap interface
import 'dotenv/config';
import coap from 'coap';
import {debugLog} from './util.js';
import EventEmitter from 'events';
import readline from 'readline';

const server = coap.createServer({type: 'udp6'});
const port = parseInt(process.env.SWITCH_PORT);

class LightSwitch{
    constructor(id) {
        this.id = id;
        this.startTime = Date.now();
        this.state = false;
        this.changeEmitter = new EventEmitter();
    }

    on() {
        this.state = true;
        this.changeEmitter.emit('change');
    }

    off() {
        this.state = false;
        this.changeEmitter.emit('change');
    }

    toggle() {
        this.state = !this.state;
        this.changeEmitter.emit('change');
    }

    toString() {
        return JSON.stringify(this);
    }

    // This method is separate from toString as it only returns select fields
    getStatus() {
        return {
            "id": this.id,
            "startTime": this.startTime,
            "state": this.state
        }
    }

    // This method provides information required to reply to a multicast discovery request.
    discoveryReply() {
        // TODO
    }
}


// Instantiate the light.
let lightSwitch = new LightSwitch(1);

// // Stimulate the light to change every second.
// setInterval(() => {
//     if(lightSwitch.state){
//         lightSwitch.off();
//     } else {
//         lightSwitch.on();
//     }
//     debugLog(`state: ${lightSwitch.state}`);
// }, 1000);

// Create key handler to change the switch value based on key press
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key)=>{
    if(key.name == 't'){
        lightSwitch.toggle();
        debugLog(`state: ${lightSwitch.state}`);
    } else if (key.name == 'q' || (key.ctrl && key.name == 'c')) {
        process.exit();
    }
})

debugLog(`New switch: ${lightSwitch.toString()}`);

server.on('request', (req, res) => {
    debugLog(`new request: ${req.method} ${req.url}`);

    if (req.method == 'POST') {
        handlePOST(req, res);
    }
    else {
        handleGET(req, res);
    }
});

function handlePOST(req, res){
    const path = req.url.split('/');
    switch(path[1]){
        default:
            debugLog(`Bad request:\n${req.url}`);
            res.code = '4.00';
            res.end('bad request');
            break;
    }
}

function handleGET(req, res){
    const path = req.url.split('/');
    switch(path[1]){
        case "status":
            if (req.headers.Observe !== 0) {
                res.code = '2.05';
                return res.end(JSON.stringify(lightSwitch.getStatus()));
            }
            const event = lightSwitch.changeEmitter.on('change', () => {
                debugLog(`send ${lightSwitch.state}`);
                res.write(JSON.stringify(lightSwitch.getStatus()));
            });

            res.on('finish', ()=>{
                debugLog('client lost');
                lightSwitch.changeEmitter.removeAllListeners(event);
            });
            break;
        default:
            debugLog(`Unknown request:\n${req.url}`);
            res.code = '4.04';
            res.end('not found');
            break;
    }
}

server.listen(port, () => {
    debugLog(`Server started on port ${port}`); 
});