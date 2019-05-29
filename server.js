/* eslint-disable */

// NOSQL & SOCKETIO & MONGOOSE SETUP
const {mongoose} = require('./server/mongoose');
const {Enter} = require('./server/enter');
const {Exit} = require('./server/enter');
const {Fan} = require('./server/fan');
const {RGB} = require('./server/rgb');
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
var five = require("johnny-five");

var board = five.Board();

let timeOut = 0;
let duration = 0;
let color = "#0000FF"  // default green
let light = false;


// Being Repl instance of johnny-five
board.on('ready', function() {

  //http://johnny-five.io/api/button/
  //http://johnny-five.io/examples/led/
  //http://johnny-five.io/examples/led-rgb/
  //http://johnny-five.io/examples/photoresistor/


  // THIS IS THE SETUP SECTION
  var led = new five.Led(8); // Set pin 13 for LED
  var button = new five.Button(2); // button
  var rgb = new five.Led.RGB({  // RGB
    pins: {
      red: 13,
      green: 12,
      blue: 11
    }
  });



  // Reading Sockets
  io.on('connection', function (socket) {




    // Button will simulate PIR sensor
    button.on("press", function() {
      console.log("press");


      light = !light;
      if (light) {
        rgb.on();
        rgb.color(color);

        var rgbData = new RGB({
          date: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
          color: color,
          type: 'motion sensor'
        });
        rgbData.save().then((doc) => {
          console.log(doc);
        });
      } else {
        rgb.off();
      }





    });

    // // Can no longer sense motion
    // button.on("release", function() {
    //   console.log("release");
    //   rgb.off();

    //   }
    // );

    // // Subscription to color definition
    socket.on('color', function(data) {
      console.log('website sent me data', data)
      color = data.color;
    });
    socket.emit('color');


    // // Subscription to color definition
    socket.on('turnOn', function(data) {
      console.log('turn on led', data)
      rgb.on();
      rgb.color(color);
      light = true;
      var rgbData = new RGB({
        date: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
        color: color,
        type: 'Website Click'
      });
      rgbData.save().then((doc) => {
        console.log(doc);
      });

    });
    socket.emit('turnOn');

    socket.on('turnOff', function(data) {
      console.log('turn off led ', data)
      light = false;
      rgb.off();
    });
    socket.emit('turnOff');

});

});

/////////  ----- DATABASE CODE
app.get('/RGB', (req, res) => {
  console.log('api working');
  RGB.find().then((data) => {
    res.send(data);
  })
})

app.post('/RGB', (req, res) => {
  // console.log(moment(Date.now()));
  var led = new RGB({
      date: moment(Date.now()),
      color: color,
      type: 'api call'
  });

  led.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

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
