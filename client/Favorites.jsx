import React from 'react';
import Request from 'superagent';
import AppBar from 'material-ui/AppBar';
import {Card, CardTitle, CardText, CardMedia, CardHeader, CardActions} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Masonry from 'react-masonry-component';
import ReactStars from 'react-stars';
import IconButton from 'material-ui/IconButton';
import FavIcon from 'material-ui/svg-icons/action/favorite-border';
import FavIconFull from 'material-ui/svg-icons/action/favorite';

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
      restaurants: [],
      favIds: []
    }
    this.getUser = this.getUser.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
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
              restaurants: res.body.user.Restaurant,
              favIds: res.body.user.favIds
            })
          }
        }
      })
  }

  removeFavorite(res) {
    let restaurant = {};
    restaurant._id = res._id;
    restaurant.name = res.name;
    restaurant.image = res.image;
    restaurant.address = res.address;
    restaurant.rating = res.rating;
    let restaurantState = this.state.restaurants;
    let fav = -1;
    restaurantState = restaurantState.filter(function(res, index) {
      if(restaurant._id === res._id){
        fav = index;
      }
      return restaurant._id !== res._id;
    });
    let username = this.state.user;
    let th = this;
    Request
      .post('/restaurants/removefavorite')
      .send({restaurant:restaurant, favId: th.state.favIds[fav], username: username})
      .end(function(err,res) {
        if(err) {
          console.log(err);
        }
        else {
          th.setState({
            restaurants: restaurantState
          })
        }
      })
  }

  render() {
    let th = this;
    console.log('here');
    return (
      <div>
        <AppBar
          title="Zomato"
          showMenuIconButton = {false}
        />
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
                let name = (<h3>{res.name}</h3>);
                let url = res.image;
                let rating = res.rating;
                if(url === "") {
                  url = './default.jpg'
                }
                let location = res.address;
                return (<div><Card style={{
                  width: '270px',
                  marginRight: '20px',
                  marginBottom: '20px'
                }}>
                <IconButton title='Add to Favorite' style={{float:'right'}}>
                  <FavIconFull onClick={th.removeFavorite.bind(this,res)}/>
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
          <h3>No favorite restaurants found.</h3>
        }
        </div>
        );
        }
        }
