// This file defines a smart light that can be turned on, off or toggled via a coap interface
require('dotenv').config()
const coap = require('coap');
const server = coap.createServer({type: 'udp6'});
require('./util');

const PORT = parseInt(process.env.SWITCH_PORT);


class LightSwitch {
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
let lightSwitch = new LightSwitch(1);
debugLog(`New switch: ${lightSwitch.toString()}`);

server.on('request', (req, res) => {
    debugLog(`new request: ${req.method} ${req.url}`);

    if (req.method == 'POST') {
        handlePOST(req, res);
    }
    else {
        handleGET(req, res);
    }
    // handleObserve(req, res);
});

// TODO: If add courtesy light
function handlePOST(req, res){
    const path = req.url.split('/');
    switch(path[1]){
//         case "courtesy":
//             light.on();
//             res.code = '2.03';
//             res.end(JSON.stringify(light.getStatus()));
//             break;
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
            res.code = '2.05';
            res.end(JSON.stringify(lightSwitch.getStatus()));
            break;
        default:
            debugLog(`Unknown request:\n${req.url}`);
            res.code = '4.04';
            res.end('not found');
            break;
    }
}

function handleObserve(req, res){
    // TODO   
}

server.listen(PORT, () => {
    debugLog(`Server started on port ${PORT}`); 
});