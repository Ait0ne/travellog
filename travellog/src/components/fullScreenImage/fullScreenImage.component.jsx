import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import {Modal, Backdrop} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import {NavigateBefore, NavigateNext} from '@material-ui/icons'

import {AWS_URL} from '../../config';
import './fullScreenImage.styles.css'
import { toggleFullscreenImage, setFullScreenImage } from '../../redux/images/images.actions';

const useStyles = makeStyles({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})


const FullScreenImage = ({isFullscreenImageShown, setFullScreenImage, toggleFullscreenImage, fullScreenImage, imageUrls}) => {
    const classes = useStyles();
    console.log(fullScreenImage)
    const [currentIndex, setCurrentIndex] = useState(imageUrls.findIndex(img=> img.imageUrl===fullScreenImage))

    const handleModalClose = () => {
        setFullScreenImage(null)
        toggleFullscreenImage()
    }

    const handleLeft = () => {
        if (currentIndex===0) {
            setCurrentIndex(imageUrls.length-1)
        } else {
            setCurrentIndex(currentIndex-1)
        }
    }

    const handleRight = () => {
        if (currentIndex===imageUrls.length-1) {
            setCurrentIndex(0)
        } else {
            setCurrentIndex(currentIndex+1)
        }
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
                <div  className='fullscreen-image-container'>
                    <img onClick={handleModalClose}  className='fullscreen-image' src={AWS_URL+imageUrls[currentIndex].imageUrl}  alt='fullscreen' />
                    {
                        imageUrls.length>1?
                        <Fragment>
                        <button className='carousel-buttons left' onClick={handleLeft}><NavigateBefore  fontSize='large' /></button>
                        <button className='carousel-buttons right' onClick={handleRight}><NavigateNext fontSize='large' /></button>
                        </Fragment>
                        :null
                    }
                    
                </div>
            </Fade>
        </Modal>
    )
}

const mapStateToProps = state => ({
    isFullscreenImageShown: state.images.isFullscreenImageShown,
    fullScreenImage: state.images.fullScreenImage,
    imageUrls: state.images.imageUrls
})

const mapDispatchToProps = dispatch => ({
    toggleFullscreenImage: () => dispatch(toggleFullscreenImage()),
    setFullScreenImage: imageUrl => dispatch(setFullScreenImage(imageUrl))
})

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenImage);

