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
    this.socket = io();
    this.socket.removeAllListeners('fanSubscriber');

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
        <div>
          <h1>IR Remote Controller</h1>
          <button onClick={() => {
            this.props.history.push('/SFpage')
          }}>Move to SmarfPage </button>
        </div>
          <p>Current Player: </p>
          <p>Game Level: </p>
          <p>Correct Answer: </p>
          <p>Combo Count : 1/3 </p>
          {
            // I define the current player
            // I will receive game level
            // i will recieve correct answer with level
            // I will receive wrong answer with level
          }

        <button onClick={this.onClick}>Push To Database</button>
      </div>
    )
  }
}

export default IRPage;