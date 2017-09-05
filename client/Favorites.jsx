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
import {Redirect, Link} from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app';

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
      favIds: [],
      open: false,
      title: false
    }
    this.getUser = this.getUser.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.getUser();
  }

  getUser() {
    let th = this;
    Request
      .get('users/showuser')
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
    restaurant.id = res.id;
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
      .post('/users/updatefavorite')
      .send({restaurant:restaurant, username: username, perform: 'removeRestaurant'})
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

  handleOpen() {
    console.log('here');
    this.setState({
      open: true
    })
  }

  handleTitle() {
    this.setState({
      title: true
    })
  }

  logout() {
    localStorage.removeItem('token');
  }

  render() {
    let th = this;
    return (
      <div>
        <AppBar
          title="Zomato"
          onLeftIconButtonTouchTap={this.handleOpen}
          onTitleTouchTap={this.handleTitle}
          style = {{cursor: 'pointer'}}
          iconElementRight={
            <Link to='/'><IconButton title = 'Logout' onClick={th.logout}>
              <LogoutIcon/>
            </IconButton></Link>
          }
        />
        <Drawer open={this.state.open}>
         <Link to='/favorite' style={{textDecoration: 'none'}}><MenuItem>Favorites</MenuItem></Link>
       </Drawer>
       {
         this.state.title && <Redirect to='/'/>
       }
        <Grid>
          <Link to='/' style={{float:'right', marginRight: '40px', fontSize: '16px'}}><p>Back</p></Link>
        <br/>
        {
          this.state.restaurants.length > 0 &&
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
                      value={parseInt(rating)}
                      size={24}
                      edit={false}
                      color2={'#ffd700'}
                    />
                  </CardText>
                </Card></div>)
              })
            }
            </Masonry></Row>
        }
        {
          th.state.restaurants.length === 0 &&
          <h3>No favorite restaurants found.</h3>
        }
      </Grid>
    </div>
        );
        }
        }
