import express from 'express';
import mongoose from 'mongoose';
import {LightSchema, LightStateSchema} from '../schema/light.js';
import {SwitchSchema, SwitchStateSchema} from '../schema/switch.js';
import {BuildingSchema} from '../schema/building.js';
import {Building} from './models/building.js';
import {Switch, SwitchState} from './models/switch.js';
import {Light, LightState} from './models/light.js';
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

app.get('/lights', async (req, res) => {
    try {
        const doc = await Light.find({});
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
    // console.log(msg);
    
    try{
        // Create building object
        const newBuilding = new Building({
            time: msg.time,
            address: msg.address,
            organisation: msg.organisation,
        });

        // Add to DB
        const doc = await newBuilding.save();
    
        // Tell the client if it failed.
        if(!doc) {
            res.status(500).send();
            return;
        }
    
        // Send result to client
        console.log("New Building:\n", doc);
        res.status(200).send(doc);
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
})

app.post('/light/new', async (req, res) => {
    const msg = validateRequest(req, res, LightSchema);
    console.log(msg);

    try {
        // Create the switch object
        const newLight = new Light({
            building: msg.buildingId,
            location: msg.location,
            startTime: msg.startTime,
            time: msg.time,
        });

        // Add to DB
        const doc = await newLight.save();

        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }

        // Send result to client
        console.log("New Light:\n", doc);
        res.status(200).send(doc);
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
});

app.post('/light/update', async (req, res) => {
    const msg = validateRequest(req, res, LightStateSchema);
    // console.log(msg);

    try{
        // Create the switch state object to update
        const newState = new LightState({
            time: msg.time,
            state: msg.state,
            light: msg.lightId
        })

        console.log(newState);

        // Add to DB
        const doc = await newState.save();
        
        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }

        // Send result to client
        console.log("New Light State:\n", doc);
        res.status(200).send(doc);
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
})

app.post('/switch/new/', async (req, res) => {
    const msg = validateRequest(req, res, SwitchSchema);
    // console.log(msg);

    try {
        // Create the switch object
        const newSwitch = new Switch({
            building: msg.buildingId,
            location: msg.location,
            startTime: msg.startTime,
            time: msg.time,
        });

        // Add to DB
        const doc = await newSwitch.save();

        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }

        // Send result to client
        console.log("New Switch:\n", doc);
        res.status(200).send(doc);
    } catch (error) {
        console.error(error);
        res.status(500).send();
        return;
    }
});

app.post('/switch/update', async (req, res) => {
    const msg = validateRequest(req, res, SwitchStateSchema);
    // console.log(msg);
    
    try{
        // Create the switch state object to update
        const newState = new SwitchState({
            time: msg.time,
            state: msg.state,
            switch: msg.switchId
        })

        console.log(newState);

        // Add to DB
        const doc = await newState.save();
        
        // Respond to client
        if(!doc) {
            res.status(500).send();
            return;
        }

        // Send result to client
        console.log("New Switch State:\n", doc);
        res.status(200).send(doc);
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
            console.log(validation.errors[0]);
            return;
        }
        return msg;
}