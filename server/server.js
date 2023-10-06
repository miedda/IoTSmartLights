import express from 'express';
import mongoose from 'mongoose';
import {LightSpecificationSchema, LightStateSchema} from '../schema/light.js';
import {SwitchSpecificationSchema, SwitchStateSchema} from '../schema/switch.js';
import {BuildingSchema} from '../schema/building.js';
import {Building} from './models/building.js';
import 'dotenv/config.js';
import {validate} from 'jsonschema';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

process.on('exit', async function (){
    console.log('Closing db connection');
    await mongoose.connection.close();
})

app.get('/building/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const doc = await Building.findOne({id: req.params.id});
        if(!doc) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        console.log(doc);
        res.status(200).send(doc);
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
});

app.get('/building', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const doc = await Building.find({});
        if(!doc) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        console.log(doc);
        res.status(200).send(doc);
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
})

app.post('/building/new', async (req, res) => {
    const msg = validateRequest(req, res, BuildingSchema);
    console.log(msg);

    // Create building object
    const newBuilding = new Building({
        id: msg.id,
        time: msg.time,
        address: msg.address,
        organisation: msg.organisation,
        lights: [],
        switches: []
    })

    try{
        // Add to DB
        const result = await Building.findOne({id: msg.id})
        if (result) {
            console.log('building already exists');
            res.status(400).send();
            return;
        }
        const doc = await newBuilding.save();
    
        // Tell the client if it failed.
        if(!doc) {
            res.status(500).send();
            return;
        }
    
        // Send result to client
        console.log(doc);
        res.status(200).send({status: 'saved'});
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
})

app.post('/light/new/', async (req, res) => {
    const msg = validateRequest(req, res, LightSpecificationSchema);
    console.log(msg);

    // Create the light object
    const newLight = {
        id: msg.id,
        time: msg.time,
        location: msg.location,
        data: []
    }

    try {
        // Add the light to its building
        const result = await Building.findOne({id: msg.building})
        if(!result) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        const light = result.lights.find((l) => l.id === msg.id);
        if (light) {
            console.log('light already exists');
            res.status(400).send();
            return;
        }
        result.lights.push(newLight);
        const doc = await result.save();
        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }
        res.status(200).send({status: 'saved'});
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
});

app.post('/light/update', async (req, res) => {
    const msg = validateRequest(req, res, LightStateSchema);
    console.log(msg);
    
    // Create the light state object to update
    const newState = {
        time: msg.time,
        startTime: msg.startTime,
        state: msg.state
    }

    try{
        // Store it in Mongo DB under its parent light
        const result = await Building.findOne({id: msg.building, 'lights.id': msg.id});
        if(!result) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        const light = result.lights.find((l) => l.id === msg.id);
        if (!light) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        light.data.push(newState);
        const doc = await result.save();
        
        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }
        console.log(doc);
        res.status(200).send({status: 'saved'});
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
})

app.post('/switch/new/', async (req, res) => {
    const msg = validateRequest(req, res, SwitchSpecificationSchema);
    console.log(msg);

    // Create the light object
    const newSwitch = {
        id: msg.id,
        time: msg.time,
        location: msg.location,
        data: []
    }

    try {
        // Add the light to its building
        const result = await Building.findOne({id: msg.building})
        if(!result) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        const lightSwitch = result.switches.find((s) => s.id === msg.id);
        if (lightSwitch) {
            console.log('switch already exists');
            res.status(400).send();
            return;
        }
        result.switches.push(newSwitch);
        const doc = await result.save();
        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }
        res.status(200).send({status: 'saved'});
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
});

app.post('/switch/update', async (req, res) => {
    const msg = validateRequest(req, res, SwitchStateSchema);
    console.log(msg);
    
    // Create the light state object to update
    const newState = {
        time: msg.time,
        startTime: msg.startTime,
        state: msg.state
    }

    try{
        // Store it in Mongo DB under its parent light
        const result = await Building.findOne({id: msg.building, 'switches.id': msg.id});
        if(!result) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        const lightSwitch = result.switches.find((s) => s.id === msg.id);
        if (!lightSwitch) {
            console.log('not found');
            res.status(404).send();
            return;
        }
        lightSwitch.data.push(newState);
        const doc = await result.save();
        
        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }
        console.log(doc);
        res.status(200).send({status: 'saved'});
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

function validateRequest(req, res, schema) {
        const msg = req.body;
        if (!msg) {
            res.status(400).send("no data");
            return;
        }
        const validation = validate(msg, schema);
        if(validation.errors.length != 0) {
            res.status(400).send(validation.errors.at(0).message);
            console.log(validation);
            return;
        }
        return msg;
}