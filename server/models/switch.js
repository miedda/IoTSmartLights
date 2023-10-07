import {mongoose} from 'mongoose';

export const SwitchState = mongoose.model('SwitchState', new mongoose.Schema({
    time: Date,
    state: Boolean,
    switch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Switch'
    }
}));

export const Switch = mongoose.model('Switch', new mongoose.Schema({
    time: Date,
    startTime: Date,
    location: String,
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building'
      }
  }));