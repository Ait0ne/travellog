import React, { Fragment} from 'react';
import './App.css';
import { hot } from 'react-hot-loader/root';
import {Switch,Route, Redirect, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';


import { setCurrentUser } from './redux/users/users.actions';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import NavBar from './components/navBar/navBar.component';
import FullScreenImage from './components/fullScreenImage/fullScreenImage.component';
import Homepage from './pages/homepage';
import Album from './pages/album';
import Auth from './pages/auth'
import Landing from './pages/landing';

class App extends React.Component {

  unsubscribeFromAuth = null

  componentDidMount() {
    const {  setCurrentUser } = this.props
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapShot => {
          setCurrentUser({
              id: snapShot.id,
              ...snapShot.data()
            });
          });
        }
      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth()
  }

  render() {
    const { currentUser, location } = this.props
    return (
      <Fragment>
        {
          location.pathname!=='/auth'?
          <NavBar/>
          :null
        }
        <Switch>
            <Route exact path='/'  component={Landing}/>
            <Route exact path='/auth' render={() => currentUser ? 
            (<Redirect to='/'/>) : (<Auth/>)}/>
            <Route exact path='/map/:userId' component={Homepage}/>
            <Route path='/:userId/:placeId' component={Album}/>
            
        </Switch>
        <FullScreenImage />
      </Fragment>
    )
  };
}

const mapStateTopProps = (state) => ({
  currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default hot(withRouter(connect(mapStateTopProps, mapDispatchToProps)(App)));


