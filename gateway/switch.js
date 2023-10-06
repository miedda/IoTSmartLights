import 'dotenv/config';
import coap from 'coap';
import {debugLog} from '../util.js';

export default class Switch {
    constructor(id, address, port){
        this.id = id,
        this.address = address,
        this.port = port,
        this.state = false,
        this.linkedLights = [],

        // Observe for switch events
        this.init();
    }
    
    init(){        
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
                debugLog(`Received switch event ${JSON.stringify(msg)}`);
                if(msg.state) {
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