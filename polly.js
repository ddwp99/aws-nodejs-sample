// Load the SDK
const AWS = require('aws-sdk')
const HttpsAgent = require('https').Agent
const Stream = require('stream')
const Speaker = require('speaker')
const Fs = require('fs')

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
    'Text': 'Hello my name is Reggie.',
    'OutputFormat': 'pcm', // mp3 | pcm
    'VoiceId': 'Kimberly',
    'SampleRate': '16000' // 8000 | 16000 RPI requies S16_LE (little endian)
    // pcm settings needs to match up with system since pcm is raw
    // (no header providing bitness, sample rate, endian etc)\
    // plughw seems to only know RESAMPLE, but not aware of bitness etc. (duh!)
}


// Create the Speaker instance
const Player = new Speaker({
    channels: 1,
    bitDepth: 16,
    sampleRate: 16000
})


speechHandler = function(err,data){
    if (err) {
        console.log(err.code)
    } else if (data) {
        if (data.AudioStream instanceof Buffer) {
            console.log("Holla!")
            console.timeEnd('timerA')
            console.time('timerA')

            // Initiate the source
            var bufferStream = new Stream.PassThrough()
            // Convert AudioStream into a readable stream
            bufferStream.end(data.AudioStream)
            // Pipe into Player
            bufferStream.pipe(Player)

            Fs.writeFile("./speech.wav", data.AudioStream,function(err){
                if(err){
                    return console.log(err);
                }
                console.log("The file was written");
            })
        }
    }
}

console.log('start')
console.time('timerA')
Polly.synthesizeSpeech(params,speechHandler)
