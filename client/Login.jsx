import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Request from 'superagent';
import {Redirect} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';

const styles = {
  paper: {
    textAlign: 'center',
    width : '30%',
    margin: 'auto',
    marginTop: '7%',
    paddingBottom: '20px'
  }
}

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      number: '',
      newUser: false,
      login: false,
      snackbar: false,
      usernameErrorText: '',
      numberErrorText: '',
      loginError: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleNewUser = this.handleNewUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
  }

  changeUsername(event) {
    this.setState({
      username: event.target.value,
      usernameErrorText: '',
      loginError: ''
    })
  }

  changePassword(event) {
    this.setState({
      password: event.target.value,
      passwordErrorText: '',
      loginError: ''
    })
  }

  changeNumber(event) {
    this.setState({
      number: event.target.value,
      numberErrorText: ''
    })
  }

  handleClick() {
    let th = this;
    let contactPattern = /[1-9]{1}[0-9]{9}/;
    let flag = true;
    if(this.state.username.trim().length === 0) {
      this.setState({
        usernameErrorText: 'Enter a valid username'
      })
      flag = false;
    }
    if(this.state.password.trim().length === 0) {
      this.setState({
        passwordErrorText: 'Enter a valid password'
      })
      flag = false;
    }
    if(this.state.number.trim().length === 0 || !contactPattern.test(this.state.number)) {
			this.setState({
				numberErrorText: 'Enter a valid 10 digit mobile number.'
			})
      flag = false;
		}
    if(flag) {
      Request
        .post('/users/signup')
        .send({username: th.state.username, password:th.state.password, number:th.state.number})
        .end(function(err,res) {
          if(err) {
            th.setState({
              usernameErrorText: 'username already exists try with a new one.',
              numberErrorText: '',
              passwordErrorText: ''
            })
          } else if(res.body.success === 'success') {
            th.handleNewUser();
            th.setState({
              snackbar: true,
              usernameErrorText: '',
              numberErrorText: '',
              passwordErrorText: ''
            })
          }
        })
      }
  }

  handleNewUser() {
    let th = this;
    this.setState({
      username: '',
      password: '',
      number: '',
      newUser: !th.state.newUser,
      snackbar: false,
      usernameErrorText: '',
      numberErrorText: ''
    })
  }

  handleLogin() {
    let th = this;
    let flag = true;
    if(this.state.username.trim().length === 0) {
      this.setState({
        usernameErrorText: 'Enter a valid username'
      });
      flag = false;
    }
    if(this.state.password.trim().length === 0) {
      this.setState({
        passwordErrorText: 'Enter a valid password'
      })
      flag = false;
    }
    if(flag) {
      Request
        .post('/users/login')
        .send({username: th.state.username, password:th.state.password})
        .end(function(err,res) {
          if(err) {
            th.setState({
              loginError: res.body.error
            })
          } else {
            localStorage.setItem('token', res.body.token);
            th.setState({
              login: true
            })
          }
        })
    }
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
                  errorText={this.state.usernameErrorText}
                /><br/>
              <TextField
                hintText="Password"
                floatingLabelText="Password"
                type="password"
                onChange={this.changePassword}
                value={this.state.password}
                errorText={this.state.passwordErrorText}
              /><br/>
              {
                this.state.newUser && <TextField
                  hintText="Mobile Number"
                  floatingLabelText="Mobile Number"
                  type="String"
                  onChange={this.changeNumber}
                  value={this.state.number}
                  errorText={this.state.numberErrorText}
                />
              }
              {
                this.state.newUser ?
                <div>
                  <RaisedButton label="Sign Up" primary={true} onClick={this.handleClick} style={{margin:'12px'}}/>
                  <RaisedButton label="Back" primary={true} onClick={this.handleNewUser} style={{margin:'12px'}}/>
                </div> :
                <div>
                  <RaisedButton label="Sign In" primary={true} onClick={this.handleLogin} style={{margin:'12px'}}/>
                  <RaisedButton label="New User?" primary={true} onClick={this.handleNewUser} style={{margin:'12px'}}/>
                  <p style={{color:'red'}}>{this.state.loginError}</p>
                </div>
              }
              {
                this.state.login && <Redirect to='/'/>
              }
            </CardText>
        </Card>
        </div>
        <Snackbar
          open={this.state.snackbar}
          message="User created successfully"
          autoHideDuration={1000}
        />
      </div>
    );
  }
}
