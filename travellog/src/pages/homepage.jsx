import React, { lazy, Suspense } from 'react';
import {
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    TextField, 
    Button, 
    Typography, 
    LinearProgress, 
} from '@material-ui/core';
import { connect } from 'react-redux';
import { toggleCreateAlbum } from '../redux/dialogs/dialogs.actions';
import { styled } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';
import CloudUpload from '@material-ui/icons/CloudUpload';
import axios from 'axios'
import { addImages } from '../firebase/firebase.utils';
import {motion} from 'framer-motion';


import Fallback from '../components/fallback/falback.component';
import {API_URL} from '../config';
import SideBar from '../components/SideBar/sidebar.component';
import AddPlaceMenu from '../components/addPlaceMenu/addPlaceMenu.component';
// import Map from '../components/map/map.component';
import './homepage.styles.css'

const Map = lazy(() => import('../components/map/map.component'));

const CustomDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column'
})

const CustomCloudUploadIcon = styled(CloudUpload)({
    fontSize: '120px',
    color: 'rgba(0,0,0,0.3)'
})

const CustomTypography = styled(Typography)({
    marginTop: '20px',
    cursor: 'default'
})


class Homepage extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
           files:[],
           name: '',
           description: '',
           noNameError: false,
           noImagesError: false, 
           isUploading: false ,
        }
    }


    handleSubmit = () => {
        const { name, description, files} = this.state
        const {selectedMarker, currentUser} = this.props
        console.log(name, description)
        console.log(files)
        if (name==='') {
            this.setState({ noNameError: true })
        }
        if (files.length===0) {
            this.setState({ noImagesError: true })
        }
        if (files.length>0 && name!=='') {
            this.setState({isUploading:true})
            const data = new FormData()
            files.map(file => {
                return data.append('file', file, file.name)
            })
            data.append('placeId', selectedMarker.name)
            data.append('userId', currentUser.id)
            axios.post(`${API_URL}images`, data)
            .then(response=> {

                const images = response.data.files
                console.log(images)
                if (images) {
                    addImages(images,selectedMarker.name, currentUser.id, name, description )
                    .then(result => {
                        this.setState( { isUploading: false })
                        this.handleClose()
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
            })
        }
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({[name]: value})
    }
    handleFileDrop = (acceptedFiles) => {
        this.setState({ files: [...this.state.files, ...acceptedFiles]})
    }

    handleClose = () => {
        this.setState({name: '', files: [], description: '', noNameError: false, noImagesError: false})
        this.props.toggleCreateAlbum()
    }
    
    render() {
        const { createAlbumShown, currentUser} = this.props
        const { name, description, files, noNameError, noImagesError, isUploading } = this.state
        return (
            <motion.div
            key='homepage'
            initial={{opacity:0}}
            animate={{opacity:1, transition: {duration: 1, ease: 'easeInOut'}}}
            exit={{opacity:0}}
            >
                <SideBar />
                <Suspense fallback={<Fallback/>}>
                    <Map />
                </Suspense>
                {
                    currentUser&&this.props.match.params.userId===currentUser.id? <AddPlaceMenu /> : null
                }
                <Dialog
                open={createAlbumShown}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id='form-dialog-title'>
                        Создание Альбома
                    </DialogTitle>
                    <CustomDialogContent>
                        <TextField 
                        error={noNameError}
                        helperText={`${noNameError?'Поле должно быть заполнено': ''}`}
                        color='secondary'
                        type='text' 
                        name='name' 
                        value={name} 
                        label='Название альбома'
                        onChange={this.handleChange}
                        required
                        />
                        <TextField 
                        color='secondary'
                        type='text' 
                        name='description' 
                        value={description} 
                        label='Описание'
                        multiline
                        rowsMax={4}
                        onChange={this.handleChange}
                        />
                        <CustomTypography color={`${noImagesError?'error':'textSecondary'}`}>
                            Добавить изображения *
                        </CustomTypography>
                        {
                            noImagesError?
                            <p className='form-error-message'>Загрузите хотя бы одно изображение</p>
                            :null
                        }
                        <Dropzone 
                        onDrop={this.handleFileDrop}
                        accept='image/jpeg'
                        >
                            {(
                                {getRootProps, getInputProps}) => (
                                <section className="dropzone-container">
                                    <div {...getRootProps({className: 'dropzone'})}>
                                        <input {...getInputProps()} />
                                        <CustomCloudUploadIcon />
                                        <p className='dropzone-text'>Перетащите изображения, или кликните для выбора файла</p>
                                    </div>
                                    {isUploading ? <LinearProgress /> : null}
                                    <aside>
                                        { 
                                        files.length>0?
                                        <CustomTypography>
                                            Выбранные изображения
                                        </CustomTypography>
                                        :null
                                        }
                                        <ul>
                                            {
                                                files.map(file => {
                                                    return <li key={file.name}>{file.name}</li>
                                                })
                                            }
                                        </ul>
                                    </aside>
                                </section>
                            )}
                        </Dropzone>
                    </CustomDialogContent>
                    <DialogActions>
                        <Button color='secondary' onClick={this.handleClose}>
                            Отменить
                        </Button>
                        <Button color='secondary' onClick={this.handleSubmit}>
                            Создать
                        </Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        )
    }
}

const mapStateToProps = state => ({
    selectedMarker: state.places.selectedMarker,
    createAlbumShown: state.dialogs.createAlbumShown,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    toggleCreateAlbum: () => dispatch(toggleCreateAlbum())
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);