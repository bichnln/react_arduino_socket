//
//  // Smart Fan Website.
//

// SMART FAN TEMPLATE
import React from 'react';
// USE THIS FOR API
import axios from 'axios';
// import fanSubscriber from '../../subcriptions/fanSubscription';

class SMPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      onCommand: '',
      data: [],
      duration: 0
    }

    this.socket = io();

    // Subscription to Temp
    this.socket.on('exampleDataRecieved', (temp) => {
      console.log(temp);
      if (parseFloat(temp) >= parseFloat(this.state.setTemp)){
        this.setState({
          currentTemp: temp,
          status: 'on'
        })
      } else {
        this.setState({
          currentTemp: temp,
          status: 'off'
        })
      }
    });

    // this.socket.emit()
    this.socket.emit('testExample');

    this.socket.on('duration', (data) => {
      console.log('website sent me data', data)
      this.setState(() => ({
        duration: data.duration
      }));
    });


    // Fetch all fan data from database
    axios.get('/RGB')
    .then((data) => {
       console.log('response ', data);
          this.setState(() => ({
            data: data.data
          }));
    })

  }

  // Update Database, Post new fan data
  onDBpush = (e) => {
    e.preventDefault();
    this.socket.emit('on', {my: 'data'});
    console.log('html toggle firing');

    // Example of pushing data to the database
    axios.post('/fan', {
      temp: this.state.onCommand,
      status: this.state.onCommand
    });

    // Example of fetching data from database
    axios.get('/fan')
    .then((response) => {
       console.log('response ', response.data);  // This is the data we receive !!

          // Within this example we are actually save the data we recieve to the current state
          this.setState(({
            temps: response.data
          }));
    })
  }

  onTextInput = (e) => {
    const input = e.target.value;
    this.setState(() => ({
        onCommand: input
      }));
  }

  onColorChange = (e) => {
    e.preventDefault();
    this.socket.emit('color', {color: e.target.value});
  }

  onChangeTurnOn = (e) => {
    e.preventDefault();
    this.socket.emit('turnOn', {turnOn: false});
  }

  onChangeTurnOff = (e) => {
    e.preventDefault();
    this.socket.emit('turnOff', {turnOff: true});
  }

  // Send Command to begin taking temprature data
  onCommand = (e) => {
    e.preventDefault();
    this.socket.emit('command', {command: this.state.onCommand});
  }

  // Render HTML
  render() {
    return (
      <div>
              <h1>Smart RGB Light</h1>
              <p>template title</p>
              <div>
                <button onClick={this.onChangeTurnOn}>Turn on led</button>
              </div>
              <div>
                <button onClick={this.onChangeTurnOff}>Turn off led</button>
              </div>
              <div>
              <div>
              <p>set duration</p>
              <input type="text" onChange={this.onTextInput} value={this.state.onCommand} id=""/>
              </div>
                <select onChange={this.onColorChange}>
                  <option value="#FF0000">Blue</option>
                  <option value="#0000FF">Red</option>
                  <option value="#00FF00">Green</option>
                </select>
              </div>


              {
                this.state.data.map((data) =>
                    <div key={data._id}>
                      <p>_id: {data._id}</p>
                      <p>date: {data.date}</p>
                      <p>color: {data.color}</p>
                      <p>type: {data.type}</p>
                    </div>
                )
              }

        </div>
    )
  }
}

export default SMPage;