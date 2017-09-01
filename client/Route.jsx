import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App.jsx';
import RouteAdd from './RouteAdd.jsx';

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Router>
        <div>
          <Route exact path= '/' component={RouteAdd}/>
          <Route exact path= '/weather' component={App}/>
        </div>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('main')
);
