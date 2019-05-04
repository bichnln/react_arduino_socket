/* eslint-disable */
const {mongoose} = require('./server/mongoose');
const {Fan} = require('./server/fan');
const {Player} = require('./server/player');
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const SerialPort = require('serialport')
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const Readline = SerialPort.parsers.Readline
const portName = process.argv[2];
const port = new SerialPort(portName, { baudRate: 9600 });
const parser = new Readline()
const publicPath = path.join(__dirname, 'public');
var app = express();
var server = http.createServer(app)
var io = socketIO(server);
app.use(express.static(publicPath));
app.use(bodyParser.json());
port.pipe(parser)

// Socket IO
// Allows us to send & receive data directly to the website
let currentTemp = 0;
let receivingTemp = false;
let receivingPlayer = false;
let correct = 0;
let wrong = 0;
let answer = 0;
let combo = 0;


// let on = () => {
//   port.write('1');
// }

// - Reading Sockets here
io.on('connection', function (socket) {
  // socket.emit('join', { message: 'handshake confirmed' });
  // Lets open a serial connection
  port.on("open", () => {
    console.log("connection made");
  })

  // // testing to see if we can send long strings
  // // serail_read_write.ino
  // socket.on("click", () => {  // socket activate
  //   console.log('click is firing');
  //   port.write("Clicked!!,"); // send through serial
  // })

  // port.write('this is from node,');

  // catch received serials
  parser.on('data', (recieveData) => {
    console.log('receivedData:', recieveData);

    let captureData = recieveData.split(':');

    if (captureData[0] == "temp") {
      console.log("I received a temp");
      socket.emit('currentTemp', captureData[1]);
    }

    if (captureData[0] == "answer") {
      console.log("I received a answer");

      socket.emit('answer', captureData[1]);
    }

    if (captureData[0] == "combo") {
      console.log("I received a combo");

      socket.emit('combo', captureData[1]);
    }

    if (captureData[0] == "correct") {
      console.log("I received a correct");

      socket.emit('correct', captureData[1]);
    }

    if (captureData[0] == "wrong") {
      console.log("I received a wrong");
      socket.emit('wrong', captureData[1]);
    }

    // if (receivingTemp) {
    //   currentTemp = recieveData;
    //   // console.log(`socket.emit('currentTemp')`);
    // }

    // if (receivingPlayer) {
    //   // i need logic
    // }
  });

  // listen
  socket.on('fanSubscriber', function(data) {
    console.log("subscribed to current temp", data);
    receivingTemp = true;
    socket.emit('currentTemp', currentTemp);
    // on();
  });

  socket.on('answerSubscriber', function(data) {
    console.log("answer: ", data);
    receivingTemp = true;
    socket.emit('answer', answer);
    // on();
  });

  socket.on('correctSubscriber', function(data) {
    console.log("user is correct: ", data);
    receivingTemp = true;
    socket.emit('correct', correct);
    // on();
  });

  socket.on('wrongSubscriber', function(data) {
    console.log("user is wrong: ", data);
    receivingTemp = true;
    socket.emit('wrong', wrong);
    // on();
  });

  socket.on('comboSubcriber', function(data) {
    console.log("user received a combo: ", data);
    receivingTemp = true;
    socket.emit('combo', combo);
    // on();
  });

  socket.on('setTemp',  function(data){
    const value = data.temp;
    port.write( value + ',');
  });

  socket.on('command',  function(data){
    const value = data.command;
    port.write( value + ',');
  });


  //Do something with received serial coms
  const onData = (recieveData) => {

  }
});

//  ----- Don't touch below this line
app.post('/fan', (req, res) => {
  console.log(req.body.text);
  var fan = new Fan({
      status: req.body.status,
      temp: req.body.temp
  });

  fan.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

app.get('/fan', (req, res) => {
  console.log('api working');
  Fan.find().then((temp) => {
    res.send(temp);
  })
})

app.get('/player', (req, res) => {
  console.log('api working');
  Player.find().then((players) => {
    res.send(players);
  })
})

app.post('/player', (req, res) => {
  console.log(req.body);
  var player = new Player({
      name: req.body.name,
      level: req.body.level
  });

  player.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});


app.get('*', function (req, res) {
  res.sendFile(path.join(publicPath, 'index.html'))
});

server.listen(8080, () => {
  console.log("Running on local host ");
});