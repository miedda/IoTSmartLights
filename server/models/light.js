import {mongoose} from 'mongoose';

export const LightState = mongoose.model('LightState', new mongoose.Schema({
  time: Date,
  state: Boolean,
  light: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Light'
  }
}));

export const Light = mongoose.model('Light', new mongoose.Schema({
  time: Date,
  startTime: Date,
  location: String,
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building'
  }
}));