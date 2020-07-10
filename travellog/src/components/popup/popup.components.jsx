import React from 'react';
import { getImages } from '../../firebase/firebase.utils';
import { CircularProgress, AppBar, Button, Toolbar, Typography} from '@material-ui/core'
import { connect } from 'react-redux';
import { styled } from '@material-ui/core/styles';
import NavigateNext from '@material-ui/icons/NavigateNext';
import { Link, withRouter } from 'react-router-dom';

import Gallery from '../gallery/gallery.component';
import { setImages } from '../../redux/images/images.actions';
import { toggleCreateAlbum } from '../../redux/dialogs/dialogs.actions';
import './popup.styles.css'

const CustomAppBar = styled(AppBar)({
    backgroundColor: "#f5f5f5",
    color: 'black'
})

const CustomToolbar = styled(Toolbar)({
    justifyContent: 'space-between',
    paddingRight: '12px'
})


class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true
        }
    }


    componentDidMount() {
        const { selectedMarker, setImages, match} = this.props
        getImages(selectedMarker.name, match.params.userId)
        .then(ref => {
            if (ref.docs.length===0) {
                setImages([])
                this.setState({isLoading:false})
            } else {
                const urls = [] 
                ref.docs.forEach((doc) => {
                    urls.push(doc.data())
                })
                setImages(urls)
                this.setState({isLoading:false})
            }

        })
    }

    handleCreateAlbum = () => {
        this.props.toggleCreateAlbum()
        this.props.close()
    }

    render() {
        const { selectedMarker, imagesUrls, currentUser, match } = this.props
        const { isLoading } = this.state
        return (
            <div className='popup-container' >
                <CustomAppBar position='static' >
                    <CustomToolbar variant='dense'>
                        <Typography >
                            {selectedMarker.title}                            
                        </Typography>
                        {
                            !isLoading&&imagesUrls.length>0 ?
                            <Link className='navigate-to-album-button' to={`/${match.params.userId}/${selectedMarker.name}`}>
                                <NavigateNext/>
                            </Link>
                            : null
                        }

                    </CustomToolbar>
                </CustomAppBar>
                <div className='popup-content-container'> 
                {   
                    isLoading ? 
                    <CircularProgress color='secondary'/>
                    :
                    <div>
                        {
                            imagesUrls.length>0 ?
                            <div className='popup-album-container'>
                                <Gallery />
                            </div>
                            :
                            <div className='popup-no-album-container'>
                                {
                                    currentUser&&match.params.userId===currentUser.id?
                                    <Button variant='contained' color='default' onClick={this.handleCreateAlbum}>Создать Альбом</Button>
                                    : null
                                }
                            </div>
                        }
                    </div>
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    selectedMarker: state.places.selectedMarker,
    imagesUrls: state.images.imageUrls,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    toggleCreateAlbum: () => dispatch(toggleCreateAlbum()),
    setImages: urls => dispatch(setImages(urls))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Popup));