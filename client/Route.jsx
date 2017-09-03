import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App.jsx';
import Login from './Login.jsx';
import Restaurant from './Restaurant.jsx';
import Favorite from './Favorites.jsx';

injectTapEventPlugin();

let alreadyLoggedIn = function(nextState, replace, callback) {
  const token = localStorage.getItem('token');
  if(token)
  	replace('/restaurant')
  return callback()
}

ReactDOM.render(
  <MuiThemeProvider>
    <Router>
          <Switch>
            <Route exact path= '/' render={() => {
              const token = localStorage.getItem('token');
              if(token)
              	return <Restaurant/>
              else {
                return <Login/>
              }
            }
            }/>
            <Route path= '/favorite' component={Favorite}/>
          </Switch>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('main')
);
