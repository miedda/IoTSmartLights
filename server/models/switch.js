import {mongoose} from 'mongoose';

const SwitchState = new mongoose.Schema({
    time: Date,
    startTime: Date,
    state: Boolean
});

export const SwitchSpecification = new mongoose.Schema({
    id: Number,
    time: Date,
    location: String,
    data: [SwitchState]
});