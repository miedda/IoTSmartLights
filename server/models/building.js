import {mongoose} from 'mongoose';

export const Building = mongoose.model('Building', new mongoose.Schema({
    time: Date,
    address: String,
    organisation: String,
}));

