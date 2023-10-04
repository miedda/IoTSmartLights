// This file defines a smart light that can be turned on, off or toggled via a coap interface
import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';

const server = coap.createServer({type: 'udp6'});
const PORT = parseInt(process.env.LIGHT_PORT);

class Light {
    constructor(id) {
        this.id = id;
        this.startTime = Date.now();
        this.state = false;
    }

    on() {
        this.state = true;
        debugLog(this.toString())
    }

    off() {
        this.state = false;
        debugLog(this.toString())
    }

    toggle() {
        this.state = !this.state;
        debugLog(this.toString())
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

// Instantiate the light
let light = new Light(0);
debugLog(`New light: ${light.toString()}`);

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
        case "on":
            light.on();
            res.code = '2.03';
            res.end(JSON.stringify(light.getStatus()));
            break;
        case "off":
            light.off();
            res.code = '2.03';
            res.end(JSON.stringify(light.getStatus()));
            break;
        case "toggle":
            light.toggle();
            res.code = '2.03';
            res.end(JSON.stringify(light.getStatus()));
            break;
        default:
            debugLog(`4.00: bad request: ${req.url}`);
            res.code = '4.00';
            res.end('bad request');
            break;
    }
}

function handleGET(req, res){
    const path = req.url.split('/');
    switch(path[1]){
        case "status":
            debugLog('205: Ok');
            res.code = '2.05';
            res.end(JSON.stringify(light.getStatus()));
            break;
        default:
            debugLog(`404: ${req.url} not found`);
            res.code = '4.04';
            res.end('not found');
            break;
    }
}

server.listen(PORT, () => {
    debugLog(`Server started on port ${PORT}`); 
});