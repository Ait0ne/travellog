import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import { AsyncTypeahead }  from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { AppBar, Typography, IconButton, Toolbar, Popover, Button} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help'; 
import { makeStyles } from '@material-ui/core/styles'
import { addPlace } from '../../firebase/firebase.utils';
import {motion} from 'framer-motion';

import geocodingService from '../../mapbox/mapbox.utils';
import { setLocation, toggleEditing, clearNewPlaces } from '../../redux/places/places.actions';
import './side-menu.styles.css';

const useStyles = makeStyles({
    root: {
        justifyContent: 'space-between'
    },
    typography: {
        padding: '10px'
    }
})






const SideMenu = ({setLocation, newPlaces, clearNewPlaces, toggleEditing, currentUser }) => {
    const [ address, setAddress ] = useState({longitude:null, latitude: null})
    const [isLoading, setIsLoading] = useState(false)
    const [options, setOptions] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null)
    const classes = useStyles();


    useEffect(() => {
        if (address.longitude) {
            setLocation(address)
        }
    }, [address, setLocation])

    const handleSearch = (query) => {
        setIsLoading(true)
        geocodingService.forwardGeocode({
            query: query,
            limit: 5
        })
        .send()
        .then(response => {
            const data = []
            response.body.features.map(feature => data.push(feature.place_name))
            setOptions(data)
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleTypeaheadChange = (selected) => {
        if (selected.length>0) {
            geocodingService.forwardGeocode({
                query: selected[0],
                limit: 1
            })
            .send()
            .then(response => {
                const data = response.body.features[0].center
                setAddress({longitude: data[0], latitude: data[1]})               
            })
            .catch(err => {
                console.log(err)
            })
        }        
    }


    const handleSubmit = async event => {
        event.preventDefault();
        await  newPlaces.map(place => {
            const {name, longitude, latitude, height} = place
            return addPlace(name, longitude, latitude, height, currentUser.id)  
        });
        clearNewPlaces();
        toggleEditing();
        console.log(event)
        
    }

    const handleHelpButton = event => {
        setAnchorEl(event.target)
    }

    const handleHelpPopoverClose = () => {
        setAnchorEl(null)
    }

    const handleSideMenuClose = () => {
        clearNewPlaces();
        toggleEditing();
    }

    
    return (
        
            <motion.div  className='side-menu-container'
            key='side-menu'
            initial={{opacity:0, scaleY:0, transformOrigin:'bottom'}}
            animate={{opacity:1, scaleY: 1,  transition: {duration:0.2}}}
            exit={{opacity:0, scaleY:0,  transition: {duration: 0.2}}}
            >
                <AppBar position='static' color='secondary'>
                    <Toolbar className={classes.root} variant='dense'>
                        <Typography variant='h6'>
                            Добавление меток
                        </Typography>
                        <IconButton 
                        edge='end'
                        onClick={handleHelpButton}
                        color='inherit'
                        >
                            <HelpIcon />
                        </IconButton>
                        <Popover 
                        id='help-popover'
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleHelpPopoverClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        >
                            <Typography className={classes.typography}>
                                Нажмите на точку на карте, чтобы добавить метку
                            </Typography>
                            <Typography className={classes.typography}>
                                Нажатие правой кнопкой мышки по метке позволит удалить ее,
                                или нажмите на метку и удерживайте на мобильном устройстве
                            </Typography>
                        </Popover>
                    </Toolbar>
                </AppBar>
                <div className='side-menu-form-container'>
                    <form onSubmit={handleSubmit} className='side-menu-form'>
                        <AsyncTypeahead 
                        clearButton
                        id='address-search'
                        isLoading={isLoading}
                        labelKey='address'
                        minLength={3}
                        placeholder='Найти место'
                        onSearch={handleSearch}
                        options={options}
                        onChange={handleTypeaheadChange}   
                        flip               
                        />

                        <div className='side-menu-form-buttons'>
                            <Button  type='submit' color='secondary'>
                                Сохранить
                            </Button>
                            <Button color='secondary' onClick={handleSideMenuClose}>
                                Отменить
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>            
    )
}

const mapStateToProps = state => ({
    newPlaces: state.places.newPlaces,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    setLocation: address => dispatch(setLocation(address)),
    toggleEditing: () => dispatch(toggleEditing()),
    clearNewPlaces: () => dispatch(clearNewPlaces())
})


export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);