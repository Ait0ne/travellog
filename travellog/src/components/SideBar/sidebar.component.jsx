import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {LocationSearching} from '@material-ui/icons';
import {connect} from 'react-redux';

import { setLocation } from '../../redux/places/places.actions';
import { toggleSideBar } from '../../redux/dialogs/dialogs.actions';
import './sidebar.styles.css';


const useStyles = makeStyles({
    list: {
        width: '250px'
    },
    typography: {
        textAlign: 'center',
        width: '250px'
    },


})


const SideBar = ({ places, setLocation, sideBarShown, toggleSideBar }) => {
    const classes = useStyles()


    const handleLocationSearch = (event, place) => {
        setLocation({longitude: place.longitude, latitude: place.latitude})
    }

    return (
        <Drawer 
        anchor='left'
        open={sideBarShown}
        onClose={toggleSideBar}
        transitionDuration={500}
        className={classes.drawer}
        ModalProps={{
            BackdropProps: {
                invisible:true
            }
        }}
        >
            <Typography variant='h6' className={classes.typography}>
                Альбомы
            </Typography>
            {
                places.length>0? places.map((place, index) => 
                <List key={place.id} className={classes.list}>
                        <ListItem button >
                            <ListItemText primary={place.name} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={(event)=> handleLocationSearch(event, place)}>
                                    <LocationSearching />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                </List>
                )
                :
                <div className='sidebar-no-album-container'>
                    <Typography variant='subtitle1'>
                        Здесь пока нет альбомов
                    </Typography>
                </div>
            }
        </Drawer>
    )
}

const mapStateToProps = state => ({
    places: state.places.places,
    sideBarShown: state.dialogs.sideBarShown
})

const mapDispatchToProps = dispatch =>({
    setLocation: place => dispatch(setLocation(place)),
    toggleSideBar: () => dispatch(toggleSideBar())
})


export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
