import React, { Fragment } from 'react';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import SideMenu from '../sideMenu/side-menu.component';
import { styled} from '@material-ui/core/styles'
import { connect } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import './addPlaceMenu.styles.css';
import { toggleEditing, clearNewPlaces } from '../../redux/places/places.actions';

const CustomFab = styled(Fab)({
    position: 'absolute',
    right: '120px',
    bottom: '50px',
    
})




const AddPlaceMenu = ({isEditing, toggleEditing, clearNewPlaces}) => {

    const handleClick = event => {
        if (isEditing) {
            clearNewPlaces()
        }
        toggleEditing()
    }

    return (
        <Fragment>
                <AnimatePresence>
                {   
                    isEditing? 
                        <SideMenu/> 
                    :null
                }
                </AnimatePresence>
                <CustomFab color="secondary" aria-label="add" onClick={handleClick}>
                    { !isEditing? <AddIcon /> : <CloseIcon/> }
                </CustomFab>
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