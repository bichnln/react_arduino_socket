/* eslint-disable */
const {mongoose} = require('./server/mongoose');
const {Fan} = require('./server/fan');
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

    if (receivingTemp) {
      currentTemp = recieveData;
      // console.log(`socket.emit('currentTemp')`);
      socket.emit('currentTemp', recieveData);
    }

    if (receivingPlayer) {
      // i need logic
    }
  });

  // listen
  socket.on('fanSubscriber', function(data) {
    console.log("subscribed to current temp", data);
    receivingTemp = true;
    socket.emit('currentTemp', currentTemp);
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
      status: 'status',
      temp: 'temp'
  });

  fan.save().then((doc) => {
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