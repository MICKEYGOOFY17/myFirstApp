import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Request from 'superagent';

const styles = {
  paper: {
    textAlign: 'center',
    width : '30%',
    margin: 'auto',
    marginTop: '15%',
    paddingBottom: '20px'
  }
}


export default class RouteAdd extends React.Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changeUsername(event) {
    this.setState({
      username: event.target.value
    })
  }

  changePassword(event) {
    this.setState({
      password: event.target.value
    })
  }

  handleClick() {
    let th = this;
    Request
      .post('/users/login')
      .send({username: th.state.username, password:th.state.password})
      .end(function(err,res) {
        console.log(res.body);
      })
  }

  render() {
    return (
      <div style={styles.container}>
        <div>
          <Paper style = {styles.paper}>
            <br/><h1 style={{color: 'green'}}>WELCOME</h1>
          <TextField
              hintText="Username"
              floatingLabelText="Username"
              onChange={this.changeUsername}
            /><br/>
          <TextField
              hintText="Password"
              floatingLabelText="Password"
              type="password"
              onChange={this.changePassword}
            /><br/>
            <RaisedButton label="Login" primary={true} onClick={this.handleClick}/>
        </Paper>
        </div>
      </div>
    );
  }
}
