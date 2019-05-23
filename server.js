/* eslint-disable */

// NOSQL & SOCKETIO & MONGOOSE SETUP
const {mongoose} = require('./server/mongoose');
const {Enter} = require('./server/enter');
const {Exit} = require('./server/enter');
const {Fan} = require('./server/fan');
const {Player} = require('./server/player');
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const SerialPort = require('serialport')
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

// SERVER LIBRARY & SETUP
const publicPath = path.join(__dirname, 'public');
var app = express();
var server = http.createServer(app)
var io = socketIO(server);
app.use(express.static(publicPath));
app.use(bodyParser.json());

// JOHNNY-FIVE CODE
var five = require('johnny-five');
var board = five.Board();

board.on('ready', function() {

  //http://johnny-five.io/api/button/
  //http://johnny-five.io/examples/led/

  // THIS IS THE SETUP SECTION
  var led = new five.Led(8); // Set pin 13 for LED
  var button = new five.Button(2); // button

  // Reading Sockets
  io.on('connection', function (socket) {

    // WRITE YOU LOGIC HERE
    button.on("hold", function() {
      console.log( "Button held" );
    });

    button.on("press", function() {
      console.log( "Button pressed" );
      led.on();
    });

    button.on("release", function() {
      console.log( "Button released" );
      led.off();
    });

    // // Subscription to temp data
    // socket.on('testExample', function(data) {
    //   console.log('I received data from website', data)
    // });

    // socket.emit('exampleDataRecieved', {});

});

});

/////////  ----- DATABASE CODE
app.post('/enter', (req, res) => {
  // console.log(moment(Date.now()));
  var enter = new Enter({
      time: moment(),
      count: '100',
      status: 'on'
  });

  enter.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

app.post('/exit', (req, res) => {
  // console.log(moment(Date.now()));
  var enter = new Enter({
      time: moment(),
      count: 'exit data',
      status: 'on'
  });

  enter.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

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
  console.log("Local host live on 8080");
});
