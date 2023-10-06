import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';

export default class Light {
    constructor(id, address, port){
        this.id = id;
        this.address = address;
        this.port = port;
        this.state = false;
    }

    on(){
        debugLog(`Turn on light ${this.id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/on'})
        req.on('response', (res) => {
            console.log('\t' + res.code);
            console.log('\t' + String(res.payload));
            return res;
        });
        req.end();
    }

    off(){
        debugLog(`Turn off light ${this.id}`);
        // Send request
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/off'})
        req.on('response', (res) => {
            console.log('\t' + res.code);
            console.log('\t' + String(res.payload));
            return res;
        });
        req.end();
    }
}