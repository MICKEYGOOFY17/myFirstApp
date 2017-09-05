import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Match} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App.jsx';
import Login from './Login.jsx';
import Restaurant from './Restaurant.jsx';
import Favorite from './Favorites.jsx';

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Router>
          <div>
            <Route exact path= '/' render={() => {
              const token = localStorage.getItem('token');
              if(token)
              	return <Restaurant/>
              else {
                return <Login/>
              }
            }
            }/>
            <Route exact path= '/favorite' component={Favorite}/>
          </div>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('main')
);
