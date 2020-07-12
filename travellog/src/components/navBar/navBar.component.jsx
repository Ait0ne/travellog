import React, { Fragment, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Menu, MenuItem, Typography } from '@material-ui/core';
import {motion} from 'framer-motion';

import Avatar from '../avatar/avatar.component';
import { toggleSideBar } from '../../redux/dialogs/dialogs.actions';
import { auth } from '../../firebase/firebase.utils';

import './navBar.styles.css';


const NavBar = ({toggleSideBar, currentUser, location, history }) => {
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
        <div className='navigation-container' 
        style={location.pathname==='/'?{
            backgroundColor:'transparent',
            borderBottom:'none',
            position:'absolute'
        }: null}
        >
            <div className='navigation'>
                {
                    location.pathname.match(/map\//)?
                    <span>
                        <span className='side-menu-button left-margin' onClick={toggleSideBar}><MenuIcon /></span>
                        <Link to='/'>
                            <span className='app-title'>Travellog</span>
                        </Link>
                    </span>
                    :
                    <span className='app-logo' onClick={() => {
                        if (location.pathname==='/') {
                            history.push('/')
                        } else {
                            history.goBack()
                        }
                    }}>
                        <motion.img 
                        whileHover={{rotate: 360, transition: {duration: 1}}}
                        className='left-margin' 
                        alt='globe' 
                        height={40} 
                        src={process.env.PUBLIC_URL+'/globe.png'}/>
                        <span className='app-title'>Travellog</span>
                    </span>
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
                            <Link onClick={handleMenuClose} to='/profile'>
                                <MenuItem>Профиль</MenuItem>
                            </Link>
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