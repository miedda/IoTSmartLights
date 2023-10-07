import fetch from 'node-fetch';


const url = 'http://localhost:3000/light/new';
const msg = {
    "buildingId": "6520dc04ca30f541be19de79",
    "time":1,
    "startTime": 1,
    "location": "apartment 1"
  };

const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(msg),
})

console.log('status', response.status);
console.log(await response.json());