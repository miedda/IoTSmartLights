import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';

export default class Switch {
    // constructor(id, address, port){
    //     this.id = id,
    //     this.address = address,
    //     this.port = port,
    //     this.state = false,
    //     this.linkedLights = [],

    //     this.init();
    // }

    constructor({id, building, location, address, port, updateFunc}){
        this.id = id;
        this.building = building;
        this.location = location;
        this.address = address;
        this.port = port;
        this.state = false;
        this.updateFunc = updateFunc;
        this.startTime = Date.now();
        this.linkedLights = [];
        
        this.init();
    }
    
    init(){
        const msg = {
            id: this.id,
            building: this.building,
            time: Date.now(),
            location: this.location
        }
        this.updateFunc('/switch/new', msg);

        // Subscribe to switch
        const switchObserveRequest = coap.request({
            observe: true,
            hostname: this.address,
            pathname: '/status',
            port: this.port,
        })
        
        console.log(`Switch ${this.id} linked to ${this.linkedLights.length == 0 ? 'nothing' : this.linkedLights }`);

        switchObserveRequest.on('response', (res) => {
            res.on('data', (data) => {
                // debugLog(data);
                const msg = JSON.parse(data);
                debugLog(msg);
                debugLog(`Received switch event ${JSON.stringify(msg)}`);
                this.state = msg.state;
                if(this.state) {
                    this.linkedLights.forEach(light => {
                        console.log(`Switch ${this.id} turning on light ${light.id} at ${light.port}`);
                        light.on();
                    })
                } else {
                    this.linkedLights.forEach(light => {
                        console.log(`Switch ${this.id} turning off light ${light.id} at ${light.port}`);
                        light.off();
                    });
                }
                // Update state in server
                const state = {
                    id: this.id,
                    building: this.building,
                    time: Date.now(),
                    startTime: this.startTime,
                    state: this.state
                };
                this.updateFunc('/switch/update', state);
            })
        })
        
        switchObserveRequest.end()
    }

    linkLight(light){
        console.log(`Switch ${this.id} linked to light ${light.id}`);
        this.linkedLights.push(light);
    }

    unlinkLight(lightId){
        this.linkedLights = this.linkedLights.filter((l) => l.id !== lightId);
    }
}