// Load the SDK
const AWS = require('aws-sdk')
const HttpsAgent = require('https').Agent;

const keepAliveAgent = new HttpsAgent({maxSockets:1, keepAlive:true});  
AWS.config.update({
    httpOptions: { agent: keepAliveAgent }
});



// Create an Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1',
    logger: console
})

let params = {
    'Text': 'Hello.',
    'OutputFormat': 'mp3',
    'VoiceId': 'Kimberly'
}



speechHandler = function(err,data){
    if (err) {
        console.log(err.code)
    } else if (data) {
        if (data.AudioStream instanceof Buffer) {
            console.log("Holla!")
            console.timeEnd('a')
            console.time('a')
            Polly.synthesizeSpeech(params,speechHandler)
        }
    }
}

console.log('start')
console.time('a')
Polly.synthesizeSpeech(params,speechHandler)
