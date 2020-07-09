import React, { Fragment } from 'react';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import SideMenu from '../sideMenu/side-menu.component';
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux';


import './addPlaceMenu.styles.css';
import { toggleEditing, clearNewPlaces } from '../../redux/places/places.actions';

const useStyles = makeStyles({
    root: {
        position:'absolute',
        right: 100,
        bottom: 50
    }
})




const AddPlaceMenu = ({isEditing, toggleEditing, clearNewPlaces}) => {
    const classes = useStyles();

    const handleClick = event => {
        if (isEditing) {
            clearNewPlaces()
        }
        toggleEditing()
    }

    return (
        <Fragment>

                {
                    isEditing? <SideMenu/> :null
                }
                <Fab className={classes.root}  color="secondary" aria-label="add" onClick={handleClick}>
                    { !isEditing? <AddIcon /> : <CloseIcon/> }
                </Fab>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    isEditing: state.places.isEditing
})

const mapDispatchToProps = dispatch => ({
    toggleEditing: () => dispatch(toggleEditing()),
    clearNewPlaces: () => dispatch(clearNewPlaces()),
})


export default connect(mapStateToProps, mapDispatchToProps)(AddPlaceMenu);