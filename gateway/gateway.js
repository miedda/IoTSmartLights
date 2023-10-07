// The purpose of the gateway is to handle direct COAP interface with the devices and interface with the broader system.
import 'dotenv/config';
import express from 'express';
import Light from './light.js';
import Switch from './switch.js';
import fetch from 'node-fetch';
import {validate} from 'jsonschema';
import { BuildingSchema } from '../schema/building.js';

// Define server interface
const serverAddress = process.env.SERVER_ADDRESS;
const serverPort = process.env.SERVER_PORT;

// Create a building that houses the lights
const buildingRequest = {
    time: Date.now(),
    address: "1 street st, City",
    organisation: "Organisation ltd"
}
const building = await updateServer('/building/new', buildingRequest, BuildingSchema);

// Create lights and switches. In a real system this would be handled by a pairing
// implemented using COAP discovery features to link devices to the gateway.
let numEachDevice = 1;
let lights = [];
const lightIP = process.env.LIGHT_ADDRESS;
const lightStartingPort = parseInt(process.env.LIGHT_PORT);
let switches = [];
const switchIP = process.env.SWITCH_ADDRESS;
const switchStartingPort = parseInt(process.env.SWITCH_PORT);

for (let i = 0; i < numEachDevice; i++) {
    lights.push(new Light({buildingId: building._id, location:'location', address: lightIP, port: lightStartingPort + i, updateFunc: updateServer}));
    // await lights[i].init()
    switches.push(new Switch({buildingId: building._id, location:'location', address: switchIP, port: switchStartingPort + i, updateFunc: updateServer}));
    switches[i].linkLight(lights[i]);
}

// process.exit();

// HTTP API
const app = express();
const port = parseInt(process.env.GATEWAY_HTTP_PORT);

app.listen(port, () => {
    console.log(`Gateway listening on port ${port}`);
});

// app.get('/ping', (req,res) => {
//     // For testing connection
//     res.send('ping');
// });

// app.get('/lights', (req, res) => {
//     // Get a list of registered lights on the gateway
//     // TODO - expand to list of lights
//     res.send(JSON.stringify(light));
// });

// app.get('/switches', (req, res) => {
//     // Get a list of registered switches on the gateway
//     // TODO - expand to list of all switches
//     res.send(JSON.stringify(lightSwitch));
// });

app.post('/on/:id', (req, res) => {
    // Turn on the light with :id
    console.log(`Request to turn on ${req.params.id}`);
    lights.forEach((l) => {
        console.log(l._id);
        if (l._id === req.params.id) {
            l.on()
            res.send(JSON.stringify(l));
        };
    })
});

app.post('/off/:id', (req, res) => {
    // Turn off the light with :id 
    console.log(`Request to turn off ${req.params.id}`);
    lights.forEach((l) => {
        console.log(l._id);
        if (l._id === req.params.id) {
            l.off()
            res.send(JSON.stringify(l));
        };
    })
});

async function updateServer(path, message, schema) {
    console.log("update", path, "with");
    console.log(message);
    const url = `http://${serverAddress}:${serverPort}${path}`;
    const validator = validate(message, schema);
    if(validator.errors.length != 0){
        console.log(validator.errors[0]);
    }
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });
        
        if(!response.ok) {
            console.log(response.status);
        }
        const doc = await response.json();
        return doc;
    } catch (error) {
        console.error(error);
    }
}






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

