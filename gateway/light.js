import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';
import {LightSchema, LightStateSchema} from '../schema/light.js';


export default class Light {
    constructor({buildingId, location, address, port, updateFunc}){
        this._id = null;
        this.buildingId = buildingId;
        this.location = location;
        this.address = address;
        this.port = port;
        this.state = false;
        this.updateFunc = updateFunc;
        this.startTime = Date.now();

        this.init();
    }

    async init(){
        const msg = {
            buildingId: this.buildingId,
            location: this.location,
            startTime: this.startTime,
            time: Date.now(),
        }

        const entry = await this.updateFunc('/light/new', msg, LightSchema);
        // this._id = entry._id;
        this.setId(entry._id);
        console.log(this);
    }

    async setId(id){
        debugLog(`Set light id to ${id}`);
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/id'})
        req.on('response', (res) => {
            debugLog(`Light id set response: ${res.code}`);
            this._id = id;
        })
        req.end(id);
    }

    async on(){
        debugLog(`Turn on light ${this._id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/on'})
        req.on('response', (res) => {
            const msg = JSON.parse(res.payload);
            console.log('\t', res.code);
            console.log('\t', msg);
            this.state = msg.state;
            return res;
        });
        req.end();

        // update state in server if id has been assigned
        if(!this._id) return;
        const state = {
            lightId: this._id,
            time: Date.now(),
            state: this.state
        }
        console.log("light state message:",state);
        const entry = await this.updateFunc('/light/update', state, LightStateSchema);
        console.log(entry)
    }

    async off(){
        debugLog(`Turn off light ${this._id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/off'})
        req.on('response', (res) => {
            const msg = JSON.parse(res.payload);
            console.log('\t', res.code);
            console.log('\t', msg);
            this.state = msg.state;
            return res;
        });
        req.end();

        // update state in server if id has been assigned
        if(!this._id) return;
        const state = {
            lightId: this._id,
            time: Date.now(),
            state: this.state
        }
        console.log("light state message:",state);
        const entry = await this.updateFunc('/light/update', state, LightStateSchema);
        console.log(entry)
    }
}