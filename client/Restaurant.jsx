import React from 'react';
import Request from 'superagent';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle, CardText, CardMedia, CardHeader, CardActions} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Masonry from 'react-masonry-component';
import ReactStars from 'react-stars';
import IconButton from 'material-ui/IconButton';
import FavIcon from 'material-ui/svg-icons/action/favorite-border';
import FavIconFull from 'material-ui/svg-icons/action/favorite';
import {Redirect} from 'react-router-dom';

const masonryOptions = {
    transitionDuration: 0
}

const styles = {
	col: {
		marginBottom: 20
	},
	masonry: {
		width: '1200px'
	}
}

export default class Restaurant extends React.Component {
  constructor() {
    super();
    this.state = {
      user: '',
      city: '',
      cuisine: '',
      cityId: 0,
      manyCities: false,
      cities: [],
      selectCuisine: false,
      restaurants: [],
      favIds: [],
      fav: false
    }
    this.getUser = this.getUser.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeCuisine = this.changeCuisine.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCity = this.handleCity.bind(this);
    this.handleRestaurant = this.handleRestaurant.bind(this);
    this.saveFavorite = this.saveFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.handleFav = this.handleFav.bind(this);
  }

  componentWillMount() {
    this.getUser();
  }

  getUser() {
    let th = this;
    Request
      .get('users/showUser')
      .set({'Authorization': localStorage.getItem('token')})
      .end(function(err, res){
        if(err) {
          console.log(err)
        }
        else {
          if(res.body.success) {
            th.setState({
              user: res.body.user.username,
              favIds: res.body.user.favIds
            })
          }
        }
      })
  }

  changeCity(event) {
    this.setState({
      city: event.target.value
    })
  }

  changeCuisine(event) {
    this.setState({
      cuisine: event.target.value
    })
  }

  handleClick() {
    let th = this;
    Request
      .get('https://developers.zomato.com/api/v2.1/cities?q=' + this.state.city
        + '&apikey=4be6f427983a4fdbbd96118609d30c06')
      .end(function(err, res) {
        if(err) {
          console.log(err);
        }
        else {
          if(res.body.location_suggestions.length > 1) {
            th.setState({
              manyCities: true,
              cities: res.body.location_suggestions
            })
          }
          else {
            th.setState({
                selectCuisine: true,
                cityId: res.body.location_suggestions.id
              })
          }
        }
      })
  }

  handleCity(city) {
    this.setState({
        selectCuisine: true,
        cityId: city.id
      })
  }

  handleRestaurant() {
    let th = this;
    Request
      .get('https://developers.zomato.com/api/v2.1/search?entity_id=' + this.state.cityId
      + '&entity_type=city&q=' + this.state.cuisine + '&count=12&apikey=4be6f427983a4fdbbd96118609d30c06')
      .end(function(err, res) {
        if(err) {
          console.log(err);
        }
        else {
          console.log(res.body.restaurants)
            th.setState({
              restaurants: res.body.restaurants
            })
        }
      });
  }

  saveFavorite(res) {
    let restaurant = {};
    restaurant.name = res.name;
    restaurant.image = res.featured_image;
    restaurant.address = res.location.address;
    restaurant.rating = res.user_rating.aggregate_rating;
    let favIds = this.state.favIds;
    favIds.push(res.id);
    let username = this.state.user;
    let th = this;
    Request
      .post('/restaurants/savefavorite')
      .send({restaurant:restaurant, favId: res.id, username: username})
      .end(function(err,res) {
        if(err) {
          console.log(err);
        }
        else {
          console.log(res);
          th.setState({
            favIds: favIds
          })
        }
      })
  }

  removeFavorite(res) {
    let restaurant = {};
    restaurant.name = res.name;
    restaurant.image = res.featured_image;
    restaurant.address = res.location.address;
    restaurant.rating = res.user_rating.aggregate_rating;
    let favIds = this.state.favIds;
    favIds = favIds.filter(function(fav) {
      return fav !== res.id
    });
    let username = this.state.user;
    let th = this;
    Request
      .post('/restaurants/removefavorite')
      .send({restaurant:restaurant, favId: res.id, username: username})
      .end(function(err,res) {
        if(err) {
          console.log(err);
        }
        else {
          console.log(res);
          th.setState({
            favIds: favIds
          })
        }
      })
  }

  handleFav() {
    this.setState({
      fav: true
    })
  }

  render() {
    let th = this;
    return (
      <div>
        <AppBar
          title="Zomato"
          showMenuIconButton = {false}
        />
        <TextField
          hintText="City"
          floatingLabelText="City"
          onChange={this.changeCity}
          value={this.state.city}
          disabled={this.state.selectCuisine}
        />
        <RaisedButton label='Show Favorites' primary={false} onClick={th.handleFav} style={{float: 'right'}}/>
        {
          this.state.manyCities &&
          <div>
            <h2>Which {this.state.city} did you mean?</h2>
            {
              this.state.cities.map(function(city, index) {
              return <RaisedButton label={city.name} primary={false} onClick={th.handleCity.bind(this, city)} style={{margin:'12px'}}/>
              })
            }
          </div>
        }
        <br/>
        {
          this.state.selectCuisine && <div><TextField
            hintText="Cuisine"
            floatingLabelText="Cuisine"
            onChange={this.changeCuisine}
            value={this.state.cuisine}
          />
          <RaisedButton label="Search" primary={true} onClick={this.handleRestaurant} style={{margin:'12px'}}/></div>
        }
        {
          (!this.state.manyCities && !this.state.selectCuisine) && <RaisedButton label="Search" primary={true} onClick={this.handleClick} style={{margin:'12px'}}/>
        }
        {
          this.state.restaurants.length > 0 && <Grid>
            <Row><Masonry
              className={'my-class'}
							elementType={'ul'}
							options={masonryOptions}
							style={styles.masonry}
              >
            {
              this.state.restaurants.map(function(res, key) {
                let restaurant = res.restaurant;
                let name = (<h3>{restaurant.name}</h3>);
                let url = restaurant.featured_image;
                let rating = restaurant.user_rating.aggregate_rating;
                if(url === "") {
                  url = './default.jpg'
                }
                let location = restaurant.location.address;
                return (<div><Card style={{
                  width: '270px',
                  marginRight: '20px',
                  marginBottom: '20px'
                }}>
                <IconButton title='Add to Favorite' style={{float:'right'}}>
                  {
                    th.state.favIds.indexOf(restaurant.id) > 0 ? <FavIconFull onClick={th.removeFavorite.bind(this,restaurant)}/> : <FavIcon onClick={th.saveFavorite.bind(this,restaurant)}/>
                  }
                </IconButton>
                  <CardHeader
                    title={name}
                  />
                  <CardMedia style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    border: '2px solid black'
                  }}>
                    <img src={url} alt="No image available" height='150px'/>
                  </CardMedia>
                  <CardText>
                    <h4>Address:</h4>
                    <p>{location}</p>
                    <h4>User Rating:({rating})</h4>
                    <ReactStars
                      count={5}
                      value={rating}
                      size={24}
                      edit={false}
                      color2={'#ffd700'}
                    />
                  </CardText>
                </Card></div>)
              })
            }
            </Masonry></Row>
          </Grid>
        }
        {
          th.state.restaurants === 'none' &&
          <h3>No restaurants found. Try some other cuisine.</h3>
        }
        {
          th.state.fav && <Redirect to='/favorite'/>
        }
      </div>
    );
  }
}
