import coap from 'coap';

const observeReq = coap.request({
    observe: true,
    hostname: '::1',
    pathname: '/status',
    port: 5001,
})

observeReq.on('response', (res) => {
    res.pipe(process.stdout);
    setTimeout(()=>{
        res.close();
        console.log('closed');
    }, 5000);
})

observeReq.end()
