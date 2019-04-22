import React from 'react';
import axios from 'axios';

// import fanSubscriber from '../../subcriptions/fanSubscription';

class SMPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      currentTemp: 'not set',
      status: 'off',
      setTemp: '20.00'
    }

    this.socket = io();

    this.socket.on('currentTemp', (temp) => {
      console.log(temp);
      if (parseFloat(temp) >= parseFloat(this.state.setTemp)){
        this.setState({
          currentTemp: temp,
          status: 'on'
        })
      } else {
        this.setState({
          currentTemp: temp
        })
      }

    });
    this.socket.emit('fanSubscriber');

  }

  onClick = (e) => {
    this.socket.emit('on', {my: 'data'});
    console.log('html toggle firing');
    // testing if arduino can recieve data
    // this.socket.emit('click');
    // axios.post('/fan', {
    //   temp: 'testing',
    //   status: 'hello'
    // });
  }

  render() {
    return (
      <div>
        <h1>Smart Fan</h1>
        <p>Current Temp:  { this.state.currentTemp }</p>
        <p>Fan Trigger Temp: { this.state.setTemp }</p>
        <p>Fan Status: { this.state.status }</p>
        <button onClick={this.onClick}>Click Me</button>
        <button onClick={() => {
          this.props.history.push('/')
        }}>Move to IRPage </button>

      </div>
    )
  }
}

export default SMPage;