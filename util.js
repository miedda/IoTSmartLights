
const logging = true;
debugLog = (msg) => {
    if (logging) console.log(msg);
}

exports.debugLog = debugLog;