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
      onCommand: ''
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

    // Fetch all fan data from database
    axios.get('/fan')
    .then((response) => {
       console.log('response ', response.data);
          this.setState(({
            temps: response.data
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

  sendCmdToServer = (e) => {
    e.preventDefault();

    this.socket.emit('command', {command: this.state.onCommand});
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
              <h1>Template</h1>


              <form action="onSubmit">
                <div>
                <input type="text" onChange={this.onTextInput} value={this.state.onCommand} id=""/>
                <button onClick={this.sendCmdToServer} > Send String Command Example </button>
                </div>
              </form>

        </div>
    )
  }
}

export default SMPage;