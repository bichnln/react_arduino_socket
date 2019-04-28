import React from 'react';
import axios from 'axios';

class IRPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      current: 'james',
      level: '0',
      answer: '0',
      players: [{
        _id: '1',
        name: 'player',
        level: '1'
      }],
      names: [
        'james', 'eamon', 'june', 'mitch'
      ]
    }
    // https://stackoverflow.com/questions/9418697/how-to-unsubscribe-from-a-socket-io-subscription
    this.socket = io();
    this.socket.removeAllListeners('fanSubscriber');

    this.socket.on('answer', (data) => {
      console.log(data);
        this.setState({
          answer: data,
        })
    });
    this.socket.emit('answerSubscriber');

    this.socket.on('correct', (data) => {
      console.log(data);
        this.setState({
          level: data,
        })
    });
    this.socket.emit('correctSubscriber');

    this.socket.on('wrong', (data) => {
      console.log(data);
        this.setState({
          level: data,
        })
    });
    this.socket.emit('wrongSubcriber');

    axios.get('/player')
    .then((response) => {
       console.log('response ', response.data);
          this.setState(({
            players: response.data
          }));
    })
    .catch((e) => {
      console.log('Something went wrong fetching /player: ', e);
    });
  }

  onClick = (e) => {
    // this.socket.emit('on', {my: 'data'});
    // console.log('html toggle firing');
    axios.post('/player',{
      name: this.state.name,
      level: this.state.level
    })

  }

  onDropDownChange = (e) => {
    if (e.target.value !== '') {
      this.setState({
        current: e.target.value
      })
    }
  }


  render() {
    return (
      <div>
        <div className="content-container">
        <div className="page-header">
            <h1 className="page-header__title">IR Remote Controller</h1>
            <button onClick={() => {
              this.props.history.push('/SFpage')
            }}>Move to Smart Fan Page </button>
          </div>
        </div>
        <div className="content-container">

          <p>Current Player: {this.state.current}</p>
          <p>Game Level: {this.state.level}</p>
          <p>Correct Answer: {this.state.answer} </p>
          <p>Combo Count : 1/3 </p>
          {
            // I define the current player
            // I will receive game level
            // i will recieve correct answer with level
            // I will receive wrong answer with level
          }

        <button onClick={this.onClick}>Save Game Progress</button>
        </div>

        <div className="content-container">
          <h3>Select player</h3>
          <select id="selectPlayer" onChange={this.onDropDownChange}>
            {
              this.state.names.map((name) => (
                <option
                  key={name}
                  name={name}
                  id={name}
                  value={name}
                >
                {name}
                </option>
                ))
            }
          </select>

          <div>
            <h3>Previously Played</h3>
            {
              this.state.players.map((player, index) => (
                  <div className="list-item" key={index}>
                    <p>player: {player.name}</p>
                    <p>level reached: {player.level}</p>
                  </div>
                ))
            }
            </div>
        </div>

      </div>
    )
  }
}

export default IRPage;