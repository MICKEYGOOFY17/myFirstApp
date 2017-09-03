import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Request from 'superagent';
import {Redirect} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';

const styles = {
  paper: {
    textAlign: 'center',
    width : '30%',
    margin: 'auto',
    marginTop: '10%',
    paddingBottom: '20px'
  }
}

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      newUser: false,
      login: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleNewUser = this.handleNewUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
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
      .post('/users/signup')
      .send({username: th.state.username, password:th.state.password})
      .end(function(err,res) {
        console.log(res.body);
      })
  }

  handleNewUser() {
    let th = this;
    this.setState({
      username: '',
      password: '',
      newUser: !th.state.newUser
    })
  }

  handleLogin() {
    let th = this;
    Request
      .post('/users/login')
      .send({username: th.state.username, password:th.state.password})
      .end(function(err,res) {
        if(res.body !== null) {
          localStorage.setItem('token', res.body.token);
          th.setState({
            login: true
          })
        }
      })
  }

  render() {
    return (
      <div style={styles.container}>
        <div>
          <AppBar
            title = "Zomato"
            showMenuIconButton = {false}
          />
          <Card style = {styles.paper}>
            <CardTitle title='WELCOME' titleColor='#009966'/>
            <CardText>
                <TextField
                hintText="Username"
                floatingLabelText="Username"
                onChange={this.changeUsername}
                value={this.state.username}
              /><br/>
              <TextField
                hintText="Password"
                floatingLabelText="Password"
                type="password"
                onChange={this.changePassword}
                value={this.state.password}
              /><br/>
              {
                this.state.newUser ?
                <div>
                  <RaisedButton label="Sign Up" primary={true} onClick={this.handleClick} style={{margin:'12px'}}/>
                  <RaisedButton label="Back" primary={true} onClick={this.handleNewUser} style={{margin:'12px'}}/>
                </div> :
                <div>
                  <RaisedButton label="Sign In" primary={true} onClick={this.handleLogin} style={{margin:'12px'}}/>
                  <RaisedButton label="New User?" primary={true} onClick={this.handleNewUser} style={{margin:'12px'}}/>
                </div>
              }
              {
                this.state.login && <Redirect to='/'/>
              }
            </CardText>
        </Card>
        </div>
      </div>
    );
  }
}
