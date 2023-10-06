import {mongoose} from 'mongoose';

export const LightState = new mongoose.Schema({
  time: Date,
  startTime: Date,
  state: Boolean
});

export const LightSpecification = new mongoose.Schema({
    id: Number,
    time: Date,
    location: String,
    data: [LightState]
});