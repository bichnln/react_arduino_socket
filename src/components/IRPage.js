import React from 'react';
import axios from 'axios';

class IRPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      temp: '9000',
      status: 'off'
    }
    // https://stackoverflow.com/questions/9418697/how-to-unsubscribe-from-a-socket-io-subscription
    socket.removeAllListeners('fanSubscriber');
    this.socket = io();
  }

  onClick = (e) => {
    this.socket.emit('on', {my: 'data'});
    console.log('html toggle firing');
    // axios.post('/fan', {
    //   temp: 'testing',
    //   status: 'hello'
    // });
  }

  render() {
    return (
      <div>
        <h1>Smart Fan Page</h1>
        <p>{ this.state.temp }</p>
        <p>{ this.state.status }</p>
        <button onClick={this.onClick}>Click Me</button>
        <button onClick={() => {
          this.props.history.push('/SFpage')
        }}>Move to SmarfPage </button>
      </div>
    )
  }
}

export default IRPage;