import {mongoose} from 'mongoose';
import { LightSpecification } from './light.js';
import { SwitchSpecification } from './switch.js';

export const Building = mongoose.model('buildingSpecification', new mongoose.Schema({
    id: Number,
    time: Date,
    address: String,
    organisation: String,
    lights: [LightSpecification],
    switches: [SwitchSpecification]
}));

