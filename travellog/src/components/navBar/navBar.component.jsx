import React, { Fragment, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Menu, MenuItem, Typography } from '@material-ui/core';

import Avatar from '../avatar/avatar.component';
import { toggleSideBar } from '../../redux/dialogs/dialogs.actions';
import { auth } from '../../firebase/firebase.utils';

import './navBar.styles.css';


const NavBar = ({toggleSideBar, currentUser, location }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    
    const handleMenuClose = () => {
        setAnchorEl(null)
        setMenuOpen(false)
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
        setMenuOpen(true)
    }

    return (
        <div className='navigation-container'>

            <div className='navigation'>
                {
                    location.pathname.match(/\/\w+\/\w+/)&&!location.pathname.match(/map/)?
                    <Link to={`/map/${location.pathname.split('/')[1]}`}>
                        <img className='left-margin' alt='globe' height={40} src={process.env.PUBLIC_URL+'/globe.png'}></img>
                        <span className='app-title'>Travellog</span>
                    </Link>
                    : 
                    null
                }
                {
                    location.pathname.match(/map\//)?
                    <span>
                        <span className='side-menu-button left-margin' onClick={toggleSideBar}><MenuIcon /></span>
                        <Link to='/'>
                            <span className='app-title'>Travellog</span>
                        </Link>
                    </span>
                    :null
                }
                
                {
                    currentUser ?
                    <Fragment>
                        <Avatar imageUrl={currentUser.avatar}  onClick={handleMenuOpen} width={45}/>
                        <Menu
                        open={menuOpen}
                        onClose={handleMenuClose}
                        anchorEl={anchorEl}
                        >
                            <Link onClick={handleMenuClose} to={`/map/${currentUser.id}`}>
                                <MenuItem>Моя Карта</MenuItem>
                            </Link>
                            <MenuItem>Профиль</MenuItem>
                            <MenuItem onClick={() => {
                                auth.signOut()
                                handleMenuClose()
                                }}>Выйти</MenuItem>
                        </Menu>
                    </Fragment>
                    :
                    <Link to='/auth'>
                        <Typography style={{marginRight: '10px'}} variant='h6' >Войти</Typography>
                    </Link>
                }

                
            </div>
        </div>

    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    toggleSideBar: () => dispatch(toggleSideBar())
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));