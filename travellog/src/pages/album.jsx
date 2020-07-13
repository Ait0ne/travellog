import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import { Typography, Button, IconButton } from '@material-ui/core'
import {styled} from '@material-ui/core/styles';
import { Edit, Delete } from '@material-ui/icons';
import axios from 'axios';
import {motion} from 'framer-motion';

import {LazyLoadImage} from 'react-lazy-load-image-component';
import EditDescriptionDialog from '../components/editDescriptionDialog/editDescriptionDialog.component';
import UploadImageDialog from '../components/uploadImageDialog/uploadImageDialog.component';
import Avatar from '../components/avatar/avatar.component';
import {AWS_URL, API_URL} from '../config';
import {firestore, removeImage} from '../firebase/firebase.utils';
import { setFullScreenImage, toggleFullscreenImage, setImages } from '../redux/images/images.actions';
import { toggleAddImages, toggleDescriptionEdit } from '../redux/dialogs/dialogs.actions';
import './album.css';
import Fallback from '../components/fallback/falback.component';

const CustomButton = styled(Button)({
    height: '30px',
    alignSelf: 'flex-end'

})


class Album extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            place: null,
            isLoading: true,
            avatarUrl: '',
            deviceWidth: null,
            deleteButtonShown: false
        }
    }
    unsubscribeFromImages = null
    clickTimer = null;

    componentDidMount() {
        const {userId, placeId} = this.props.match.params
        this.setDeviceWidth()
        window.addEventListener('resize', this.setDeviceWidth)
        this.setState({isLoading: true})
        firestore
        .collection('avatars')
        .doc(userId)
        .get()
        .then(userRef => {
            userRef.exists?
            this.setState({avatarUrl: userRef.data().avatarUrl})
            : this.setState({avatarUrl: '/defaultAvatar.jpg'})
            }
        )
        firestore
        .collection('users')
        .doc(userId)
        .collection('places')
        .doc(placeId)
        .get()
        .then(ref => {
            console.log(ref)
            this.setState({ place:ref.data() })
            this.unsubscribeFromImages = firestore
            .collection('users')
            .doc(userId)
            .collection('places')
            .doc(placeId)
            .collection('images')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                console.log(snapshot)
                const images = []
                snapshot.docs.map((doc)=> 
                    images.push({ ...doc.data(), id:doc.id})
                )
                this.props.setImages(images)
                this.setState({isLoading:false})
            })
        })
    }

    componentWillUnmount() {
        this.unsubscribeFromImages();
        window.removeEventListener('resize', this.setDeviceWidth)
    }

    setDeviceWidth = () => {
        this.setState({deviceWidth: document.body.scrollWidth})
    }

    handleImageClick = (image) => {
        const { toggleFullscreenImage, setFullScreenImage } = this.props
        setFullScreenImage(image.imageUrl)
        toggleFullscreenImage()
    }

    handleImageUpload = () => {
        const {toggleAddImages} = this.props
        console.log(toggleAddImages)
        toggleAddImages()
    }

    handleDeleteImage = (event, image) => {
        const {placeId, userId} = this.props.match.params
        removeImage(userId, placeId, image.id)
        .then((result) => {
            if (result) {
                axios.post(`${API_URL}deleteImage`,
                {
                    placeId: placeId,
                    imageId: image.id,
                    userId: userId
                })
            }
        })
    }

    handleEditDescription = (newName, newDescription) => {
        console.log(newName, )
        this.setState({place:{...this.state.place, name: newName, description: newDescription}})
    }

    onMouseDown = (event) => {
        console.log('1',event)
        const { currentUser, match } = this.props
        this.clickTimer = setTimeout(() => {
            if (currentUser&& match.params.userId===currentUser.id) {
                return this.setState({deleteButtonShown:true})
            }
        }, 1000)
    }

    onMouseUp = (event, image) => {
        console.log('2',event)
        clearTimeout(this.clickTimer)
        if (!this.state.deleteButtonShown) {
            this.handleImageClick(image)
        }
    }
    onMouseLeave = (event) => {
        if (this.state.deleteButtonShown) {
            this.setState({deleteButtonShown: false})
        }
    }

    handleContextMenu = event => {
        event.preventDefault();
        this.setState({deleteButtonShown: true})
    }

    handleTouchStart = event => {
        event.preventDefault();
    }


    render() {
        const { isLoading,  place, avatarUrl, deviceWidth, deleteButtonShown } = this.state
        const { toggleDescriptionEdit, editDescriptionShown, match, currentUser, images } = this.props
        return (
            <Fragment>
                {console.log(avatarUrl)}
                {
                    !isLoading?
                    <motion.div
                    className='album-container'
                    key='album-page'
                    initial={{opacity:0}}
                    animate={{opacity:1, transition: {duration: 0.8, ease: 'easeInOut'}}}
                    exit={{opacity:0}}
                    >
                        <div className='account-and-album-info'>
                            <div className='album-description-row'>
                                <Avatar width={150} border={true} imageUrl={avatarUrl}/>
                                <div className='album-description'>
                                    <Typography variant='h5'>
                                        {place.name}
                                        {
                                            currentUser&& match.params.userId===currentUser.id?
                                            <IconButton onClick={toggleDescriptionEdit}>
                                                <Edit color='secondary'/>
                                            </IconButton>
                                            :null
                                        }
                                    </Typography>
                                    <Typography variant='body1'>
                                        {place.description}
                                    </Typography>
                                </div>
                            </div>
                            {
                                currentUser&& match.params.userId===currentUser.id?
                                <CustomButton onClick={this.handleImageUpload} variant='text' color='secondary'>Добавить Фото</CustomButton>
                                :null
                            }
                            
                        </div>
                        <hr className='divider' />
                        <div className='album-container-inner'>
                            {   
                                images.length>0?
                                images.map((image, index) => {
                                    return (
                                    <div 
                                    key={index}  
                                    className='album-image-container'
                                    onMouseDown={this.onMouseDown}
                                    onMouseUp={(event)=>this.onMouseUp(event, image)}
                                    onMouseLeave={this.onMouseLeave}
                                    onTouchStart={this.handleTouchStart}
                                    // onTouchEnd={(event)=>this.onMouseUp(event, image)}
                                    onContextMenu={this.handleContextMenu}
                                    >   
                                        {
                                            deleteButtonShown?
                                            <div className='image-actions-buttons' onClick={() =>this.handleImageClick(image)} >
                                                <button onClick={(event) => this.handleDeleteImage(event, image)} className='image-action-button delete'><Delete/></button>
                                            </div>
                                            : null
                                        }
                                        <LazyLoadImage className='album-image' width={deviceWidth&&deviceWidth<955? (deviceWidth-45)/3 : 300} height={deviceWidth&&deviceWidth<955? (deviceWidth-45)/3 : 300}  src={`${AWS_URL}${image.mediumImageUrl}`}/>
                                    </div>
                                    )
                                })
                                : 
                                <div className='album-no-images-container'>                                   
                                    <Typography>Здесь пока нет фотографий</Typography>
                                </div>
                            }
                        </div>
                        <UploadImageDialog  
                        place={this.props.match.params.placeId}  
                        userId={this.props.match.params.userId} 
                        />
                        {
                            editDescriptionShown?
                            <EditDescriptionDialog 
                            placeId={this.props.match.params.placeId} 
                            place={place}
                            userId={currentUser.id} 
                            handleEditDescription={this.handleEditDescription}
                            />
                            : null
                        }

                    </motion.div>
                    : <Fallback />
                }
                
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    editDescriptionShown: state.dialogs.editDescriptionShown,
    currentUser: state.user.currentUser,
    images: state.images.imageUrls
})

const mapDispatchToProps = dispatch => ({
    toggleFullscreenImage: () => dispatch(toggleFullscreenImage()),
    setFullScreenImage: imageUrl => dispatch(setFullScreenImage(imageUrl)),
    toggleAddImages:() => dispatch(toggleAddImages()),
    toggleDescriptionEdit: () => dispatch(toggleDescriptionEdit()),
    setImages: images => dispatch(setImages(images))
})


export default connect(mapStateToProps, mapDispatchToProps)(Album);