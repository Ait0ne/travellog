import React from 'react';
import { connect } from 'react-redux';
import {Modal, Backdrop} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';


import { toggleFullscreenImage, setFullScreenImage } from '../../redux/images/images.actions';

const useStyles = makeStyles({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})


const FullScreenImage = ({isFullscreenImageShown, setFullScreenImage, toggleFullscreenImage, fullScreenImage}) => {
    const classes = useStyles();

    const handleModalClose = () => {
        setFullScreenImage(null)
        toggleFullscreenImage()
    }

    return (
        <Modal 
        open={isFullscreenImageShown}
        onClose={handleModalClose}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout:500
        }}
        >
            <Fade in={isFullscreenImageShown}>
                <img onClick={handleModalClose} className='fullscreen-image' src={fullScreenImage}  alt='fullscreen' />
            </Fade>
        </Modal>
    )
}

const mapStateToProps = state => ({
    isFullscreenImageShown: state.images.isFullscreenImageShown,
    fullScreenImage: state.images.fullScreenImage
})

const mapDispatchToProps = dispatch => ({
    toggleFullscreenImage: () => dispatch(toggleFullscreenImage()),
    setFullScreenImage: imageUrl => dispatch(setFullScreenImage(imageUrl))
})

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenImage);

