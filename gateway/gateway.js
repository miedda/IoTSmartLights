// The purpose of the gateway is to handle direct COAP interface with the devices and interface with the broader system.
import 'dotenv/config';
import express from 'express';
import Light from './light.js';
import Switch from './switch.js';

// Create lights and switches. In a real system this would be handled by a pairing
// implemented using COAP discovery features to link devices to the gateway.
let numEachDevice = 2;
let lights = [];
const lightIP = process.env.LIGHT_ADDRESS;
const lightStartingPort = parseInt(process.env.LIGHT_PORT);
let switches = [];
const switchIP = process.env.SWITCH_ADDRESS;
const switchStartingPort = parseInt(process.env.SWITCH_PORT);

for (let i = 0; i < numEachDevice; i++) {
    lights.push(new Light(i, lightIP, lightStartingPort + i));
    switches.push(new Switch(i, switchIP, switchStartingPort + i));
    switches[i].linkLight(lights[i]);
}
console.log("\nLights\n\n", lights);
console.log("\nSwitches\n\n", switches);
switches.forEach((s) => {console.log("Switch ", s.id, " has ", s.linkedLights)});


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
    console.log(req.params.id);
    const light = result.lights.find((l) => l.id === req.params.id);
    light.on();
    res.send(JSON.stringify(light));
});

app.post('/off/:id', (req, res) => {
    // Turn off the light with :id 
    const light = result.lights.find((l) => l.id === req.params.id);
    light.off();
    res.send(JSON.stringify(light));
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

