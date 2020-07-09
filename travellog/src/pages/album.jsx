import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import { CircularProgress, Typography, Button, IconButton } from '@material-ui/core'
import {styled} from '@material-ui/core/styles';
import { Edit, Delete } from '@material-ui/icons';
import axios from 'axios';

import {LazyLoadImage} from 'react-lazy-load-image-component';
import EditDescriptionDialog from '../components/editDescriptionDialog/editDescriptionDialog.component';
import UploadImageDialog from '../components/uploadImageDialog/uploadImageDialog.component';
import Avatar from '../components/avatar/avatar.component';
import {AWS_URL, API_URL} from '../config';
import {firestore, removeImage} from '../firebase/firebase.utils';
import { setFullScreenImage, toggleFullscreenImage } from '../redux/images/images.actions';
import { toggleAddImages, toggleDescriptionEdit } from '../redux/dialogs/dialogs.actions';
import './album.css';

const CustomButton = styled(Button)({
    height: '30px',
    alignSelf: 'flex-end'

})


class Album extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            images: [],
            place: null,
            isLoading: true,
            avatarUrl: ''
        }
        this.handleEditDescription = this.handleEditDescription.bind(this)
    }
    unsubscribeFromImages = null

    componentDidMount() {
        const {userId, placeId} = this.props.match.params
        this.setState({isLoading: true})
        firestore
        .collection('avatars')
        .doc(userId)
        .get()
        .then(userRef => {
            userRef.exists?
            this.setState({avatarUrl: userRef.data()})
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
                this.setState({images: images, isLoading:false})
            })
        })
    }

    componentWillUnmount() {
        this.unsubscribeFromImages()
    }


    handleImageClick = (event,image) => {
        const { toggleFullscreenImage, setFullScreenImage } = this.props
        setFullScreenImage(`${AWS_URL}${image.imageUrl}`)
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


    render() {
        const { isLoading, images, place, avatarUrl } = this.state
        const { toggleDescriptionEdit, editDescriptionShown, match, currentUser } = this.props
        return (
            <Fragment>
                {
                    !isLoading?
                    <div className='album-container'>
                        <div className='account-and-album-info'>
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
                                    onClick={
                                        !(currentUser&& match.params.userId===currentUser.id)?
                                        (event) => this.handleImageClick(event, image)
                                        :null
                                    }
                                    >   
                                        {
                                            currentUser&& match.params.userId===currentUser.id?
                                            <div className='image-actions-buttons' >
                                                <button onClick={(event) => this.handleImageClick(event, image)} className='image-action-button'>Просмотр</button>
                                                <button onClick={(event) => this.handleDeleteImage(event, image)} className='image-action-button'><Delete/></button>
                                            </div>
                                            : null
                                        }
                                        <LazyLoadImage className='album-image' width={300} height={300}   src={`${AWS_URL}${image.mediumImageUrl}`}/>
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

                    </div>
                    : <CircularProgress color='inherit'/>
                }
                
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    editDescriptionShown: state.dialogs.editDescriptionShown,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    toggleFullscreenImage: () => dispatch(toggleFullscreenImage()),
    setFullScreenImage: imageUrl => dispatch(setFullScreenImage(imageUrl)),
    toggleAddImages:() => dispatch(toggleAddImages()),
    toggleDescriptionEdit: () => dispatch(toggleDescriptionEdit())
})


export default connect(mapStateToProps, mapDispatchToProps)(Album);