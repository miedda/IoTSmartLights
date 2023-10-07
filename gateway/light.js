import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';

export default class Light {
    constructor({id, building, location, address, port, updateFunc}){
        this.id = id;
        this.building = building;
        this.location = location;
        this.address = address;
        this.port = port;
        this.state = false;
        this.updateFunc = updateFunc;
        this.startTime = Date.now();

        this.init();
    }

    init(){
        const msg = {
            id: this.id,
            building: this.building,
            time: Date.now(),
            location: this.location
        }
        this.updateFunc('/light/new', msg);
    }

    on(){
        debugLog(`Turn on light ${this.id}`);
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

        // update state in server
        const state = {
            id: this.id,
            building: this.building,
            time: Date.now(),
            startTime: this.startTime,
            state: this.state
        }
        // this.updateFunc('/light/update', state);
    }

    off(){
        debugLog(`Turn off light ${this.id}`);
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

        // update state in server
        const state = {
            id: this.id,
            building: this.building,
            time: Date.now(),
            startTime: this.startTime,
            state: this.state
        }

        debugLog(state);

        // this.updateFunc('/light/update', state);
    }
}