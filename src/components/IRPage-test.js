//
//  // Website used for Demoing, shows correct answer.
//

import React from 'react';
import axios from 'axios';

class IRPageTest extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      current: 'james',
      level: '0',
      answer: '0',
      wrong: true,
      combo: '0',
      command: '',
      players: [{
        _id: '1',
        name: 'player',
        level: '1'
      }],
      names: [
        'james', 'eamon', 'june', 'mitch'
      ]
    }

    // Connect to Socket IO
    this.socket = io();
    this.socket.removeAllListeners('fanSubscriber');  // removes subscriptions

    this.socket.on('answer', (data) => {  // listen for subscription
      console.log(data);
        this.setState({
          answer: data,
        })
    });
    this.socket.emit('answerSubscriber');

    this.socket.on('correct', (data) => {  // listen for subscription
      console.log(data);
        this.setState({
          level: data,
          wrong: false
        })
    });
    this.socket.emit('correctSubscriber');

    this.socket.on('wrong', (data) => {  // listen for subscription
      console.log(data);
        this.setState({
          level: data,
          wrong: true
        })
    });
    this.socket.emit('wrongSubcriber');

    this.socket.on('combo', (data) => { // listen for subscription
      console.log(data);
        this.setState({
          combo: data
        })
    });
    this.socket.emit('comboSubcriber');


    // Call API to fetch from database
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

  // Add Players to database using API
  onClick = (e) => {
    // this.socket.emit('on', {my: 'data'});
    // console.log('html toggle firing');
    axios.post('/player',{
      name: this.state.current,
      level: this.state.level
    })

    // Update the list of players with new date, as we have just added a player
    axios.get('/player')
    .then((response) => {
       console.log('response ', response.data);
          this.setState(({
            players: response.data
          }));
    })

  }

  onDropDownChange = (e) => {
    if (e.target.value !== '') {
      this.setState({
        current: e.target.value
      })
    }
  }

  onCommandText = (e) => {
    const command = e.target.value;
    this.setState(() => ({
        command
      }));
  }

  // Sends Commands to Start IR Fan
  onCommand = (e) => {
    e.preventDefault();
    this.socket.emit('command', {command: this.state.command});
  }

  // Display logic
  renderMe = () => {
    if (this.state.wrong) {
        return (
          <td>no</td>
        )
      }
    return  <td>yes</td>;

  }

  // Render HTML
  render() {
    return (
      <div>
        <div className="content-container">
        <div className="page-header">
            <h1 className="page-header__title">IR RemoteT Control</h1>
            <button onClick={() => {
              this.props.history.push('/SFpage')
            }}>Move to Smart Fan Page </button>

            <button onClick={() => {
              this.props.history.push('/IRpage')
            }}>Move to Main IR Fan Page </button>
          </div>
        </div>
        <div className="content-container flex">

        <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Current Player: </td>
            <td>{this.state.current}</td>
          </tr>
          <tr>
            <td>Game Level:  </td>
            <td> {this.state.level} </td>
          </tr>
          <tr>
            <td>Correct Answer:</td>
            <td>{this.state.answer} </td>
          </tr>
          <tr>
            <td>Was the user correct? :</td>
            {
              this.state.combo > 0 ?
                this.renderMe()  : ' Starting... '
            }
          </tr>
          <tr>
            <td>Current Combo:</td>
            <td>{this.state.combo} </td>
          </tr>
        </tbody>
      </table>

      <div className="save">
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
          <button className="button" onClick={this.onClick}>Save Game Progress</button>

        </div>
        <form >

          <div classinName="form-container">
          <input type="text" onChange={this.onCommandText} value={this.state.command} id=""/>
          <button className="button" onClick={this.onCommand} > Cmd </button>
          </div>
        </form>


        </div>

        <div className="content-container flex">


          <div>
            <h3 className="database-title">Previously Played</h3>
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

export default IRPageTest;