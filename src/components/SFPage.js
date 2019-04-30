import React from 'react';
import axios from 'axios';

// import fanSubscriber from '../../subcriptions/fanSubscription';

class SMPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      currentTemp: 'not set',
      status: 'off',
      setTemp: '30.00',
      command: ''
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
          currentTemp: temp,
          status: 'off'
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
    axios.post('/fan', {
      temp: this.state.currentTemp,
      status: this.state.status
    });
  }

  onCommandText = (e) => {
    const command = e.target.value;
    this.setState(() => ({
        command
      }));
  }


  onTextInput = (e) => {
    const setTemp = e.target.value;
    this.setState(() => ({
        setTemp
      }));
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.currentTemp >= this.state.setTemp) {
      this.setState(() => ({
        status: 'on'
      }))
    }
    this.socket.emit('setTemp', {temp: this.state.setTemp});
  }

  onCommand = (e) => {
    e.preventDefault();
    this.socket.emit('command', {command: this.state.command});
  }

  render() {
    return (
      <div>
          <div className="content-container">
            <div className="page-header">
              <h1 className="page-header__title">Smart Fan Controller</h1>
              <button onClick={() => {
                this.props.history.push('/')
              }}>Move to IR Remote Controller </button>
            </div>
          </div>

          <div className="content-container">

              <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current Temp: </td>
                  <td>{ this.state.currentTemp }</td>
                </tr>
                <tr>
                  <td>Threshold Temp: </td>
                  <td>{ this.state.setTemp } </td>
                </tr>
                <tr>
                  <td>Fan Status: </td>
                  <td>{ this.state.status } </td>
                </tr>
              </tbody>
            </table>


              <form action="onSubmit">

                <div>
                <input type="text" onChange={this.onTextInput} value={this.state.setTemp} id=""/>
                <button className="button" onClick={this.onSubmit} > SetT </button>
                </div>
                <div>
                <input type="text" onChange={this.onCommandText} value={this.state.command} id=""/>
                <button className="button" onClick={this.onCommand} > Cmd </button>
                </div>
                <div>
                <button className="button" onClick={this.onClick}> UpdateDB </button>
                </div>

              </form>
        </div>
      </div>
    )
  }
}

export default SMPage;