import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';
import { SwitchSchema, SwitchStateSchema } from '../schema/switch.js';


export default class Switch {
    constructor({buildingId, location, address, port, updateFunc}){
        this._id = null;
        this.buildingId = buildingId;
        this.location = location;
        this.address = address;
        this.port = port;
        this.state = false;
        this.updateFunc = updateFunc;
        this.startTime = Date.now();
        this.linkedLights = [];
        
        this.init();
    }
    
    async init(){
        const msg = {
            buildingId: this.buildingId,
            location: this.location,
            startTime: this.startTime,
            time: Date.now(),
        }

        const entry = await this.updateFunc('/switch/new', msg, SwitchSchema);
        // this._id = entry._id;
        this.setId(entry._id);
        // console.log(this);

        // Subscribe to switch
        const switchObserveRequest = coap.request({
            observe: true,
            hostname: this.address,
            pathname: '/status',
            port: this.port,
        })
        
        console.log(`Switch ${this._id} linked to ${this.linkedLights.length == 0 ? 'nothing' : this.linkedLights }`);

        switchObserveRequest.on('response', (res) => {
            res.on('data', (data) => {
                // debugLog(data);
                const msg = JSON.parse(data);
                debugLog(msg);
                debugLog(`Received switch event ${JSON.stringify(msg)}`);
                this.state = msg.state;
                if(this.state) {
                    this.linkedLights.forEach(light => {
                        console.log(`Switch ${this._id} turning on light ${light._id} at ${light.port}`);
                        light.on();
                    })
                } else {
                    this.linkedLights.forEach(light => {
                        console.log(`Switch ${this._id} turning off light ${light._id} at ${light.port}`);
                        light.off();
                    });
                }
                // Update state in server
                if(!this._id) return;
                const state = {
                    switchId: this._id,
                    time: Date.now(),
                    state: this.state
                };
                this.updateFunc('/switch/update', state, SwitchStateSchema);
            })
        })
        
        switchObserveRequest.end()
    }

    async setId(id){
        debugLog(`Set switch id to ${id}`);
        const req = coap.request({hostname: this.address, port: this.port, method: 'post', pathname: '/id'})
        req.on('response', (res) => {
            debugLog(`Switch id set response: ${res.code}`);
            this._id = id;
        })
        req.end(id);
    }

    linkLight(light){
        this.linkedLights.push(light);
        console.log(`Switch ${this._id} linked to light ${this.linkedLights[this.linkedLights.length-1]._id}`);
    }

    unlinkLight(lightId){
        this.linkedLights = this.linkedLights.filter((l) => l.id !== lightId);
    }
}