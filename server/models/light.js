import {mongoose} from 'mongoose';

export const LightState = new mongoose.Schema({
  time: Date,
  state: Boolean,
  light: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Light'
  }
});

export const Light = new mongoose.Schema({
  time: Date,
  startTime: Date,
  location: String,
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building'
  }
});