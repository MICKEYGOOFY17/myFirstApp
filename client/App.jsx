import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import AutoComplete from 'material-ui/AutoComplete';

let countries = require ('countries-cities').getCountries();
let cities = [];

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      latitude: '',
      longitude: '',
      country: '',
      sunrise: '',
      sunset: '',
      windSpeed: '',
      temprature: '',
      pressure: '',
      humidity: '',
      description: '',
      district: '',
      selectedValue: '',
      countrySelect: '',
      selectedCity: ''
    }
    this.click = this.click.bind(this);
    this.handleUpdateCountry = this.handleUpdateCountry.bind(this);
    this.addSearchCountry = this.addSearchCountry.bind(this);
    this.handleUpdateCity = this.handleUpdateCity.bind(this);
  }

  click(district) {
    let th = this;
    Request
      .get('http://api.openweathermap.org/data/2.5/weather?q='+district+'&appid=2465be30a466173a5363bb4c7fb8bd45')
      .end(function(err, res) {
        if(err) {
          console.log(err)
        }
        else {
          let weather = res.body;
          th.setState({
            district: district,
            latitude: weather.coord.lat,
            longitude: weather.coord.lon,
            country: weather.sys.country,
            sunrise: weather.sys.sunrise,
            sunset: weather.sys.sunset,
            windSpeed: weather.wind.speed,
            temprature: weather.main.temp,
            pressure: weather.main.pressure,
            humidity: weather.main.humidity,
            description: weather.weather[0].description
          })
        }
      })
  }

  handleUpdateCountry(value) {
		this.setState({
			selectedValue: value
		})
	}

  addSearchCountry(value) {
    this.setState({
			selectedValue: value,
      countrySelect: value
		});
    cities = require ('countries-cities').getCities(value);
    cities.some(function(city, index){
      if(city === 'Selam') {
        cities[index] = 'Salem'
      }
    })
  }

  handleUpdateCity(value) {
		this.setState({
			selectedCity: value
		})
	}


  render() {
    var sunrise = this.state.sunrise;
    var dsunrise = new Date(0);
    dsunrise.setUTCSeconds(sunrise);

    var sunset = this.state.sunset;
    var dsunset = new Date(0);
    dsunset.setUTCSeconds(sunset);

    sunrise = dsunrise.getHours()+':'+dsunrise.getMinutes()+':'+dsunrise.getSeconds();
    sunset = dsunset.getHours()+':'+dsunset.getMinutes()+':'+dsunset.getSeconds();

    let temprature = this.state.temprature - 273;

    return (
      <MuiThemeProvider>
        <div>
         Hi,
         <h3>Choose your country and city </h3>
         <AutoComplete
           filter={AutoComplete.fuzzyFilter}
           dataSource={countries}
           searchText={this.state.selectedValue}
           onUpdateInput={this.handleUpdateCountry}
           onNewRequest={this.addSearchCountry}
           hintText = 'Enter the country'
         /><br/>
         {
           this.state.countrySelect !== '' && <AutoComplete
             filter={AutoComplete.fuzzyFilter}
             dataSource={cities}
             searchText={this.state.selectedCity}
             onUpdateInput={this.handleUpdateCity}
             onNewRequest={this.click}
             hintText = 'Enter the city'
           />
         }
         {
         this.state.district !== '' &&
         <div>
           <h3>Weather in <span style={{color:'blue'}}>{this.state.district}</span>: <span style={{color:'green'}}>{this.state.description}</span></h3>
           <h3>Temperature : <span style={{color:'green'}}>{temprature} {String.fromCharCode(176)}C</span></h3>
           <h3>Sunrise at: <span style={{color:'green'}}>{sunrise}</span></h3>
           <h3>Sunset at: <span style={{color:'green'}}>{sunset}</span></h3>
           <h3>Humidity: <span style={{color:'green'}}>{this.state.humidity} %</span></h3>
           <h3>Pressure: <span style={{color:'green'}}>{this.state.pressure} hpa</span></h3>
           <h3>Wind: <span style={{color:'green'}}>{this.state.windSpeed} m/s</span> </h3>
        </div>
        }
        <br/>
      </div>
    </MuiThemeProvider>);
  }
}
