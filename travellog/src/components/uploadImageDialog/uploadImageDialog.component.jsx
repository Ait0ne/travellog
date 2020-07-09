import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    LinearProgress,
    DialogActions,
    Button
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import axios from  'axios'

import {API_URL} from '../../config'
import { addImages } from '../../firebase/firebase.utils';
import { toggleAddImages } from '../../redux/dialogs/dialogs.actions';
import './uploadImageDialog.styles.css';


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


class UploadImageDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           files:[],
           noImagesError: false, 
           isUploading: false ,
        }
    }


    handleSubmit = () => {
        const { files } = this.state
        const { place, userId } = this.props

        if (files.length===0) {
            this.setState({ noImagesError: true })
        }
        if (files.length>0) {
            this.setState({isUploading:true})
            const data = new FormData()
            files.map(file => {
                return data.append('file', file, file.name)
            })
            data.append('placeId', place )
            data.append('userId', userId)
            axios.post(`${API_URL}images`, data)
            .then(response=> {
                const images = response.data.files
                if (images) {
                    addImages(images, place, userId )
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


    handleFileDrop = (acceptedFiles) => {
        this.setState({ files: [...this.state.files, ...acceptedFiles]})
    }

    handleClose = () => {
        this.setState({files: [],  noImagesError: false})
        this.props.toggleAddImages()
    }

    render() {
        const { addImagesShown } = this.props
        const { files, noImagesError, isUploading } = this.state
        return (
            <Dialog
                    open={addImagesShown}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    >
                        {console.log(this.props.place)}
                        <DialogTitle id='form-dialog-title'>
                            Загрузка Фото
                        </DialogTitle>
                        <CustomDialogContent>
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
                                Загрузить
                            </Button>
                        </DialogActions>
                    </Dialog>
        )}
}

const mapStateToProps = state => ({
    addImagesShown: state.dialogs.addImagesShown
})

const mapDispatchToProps = dispatch => ({
    toggleAddImages: () => dispatch(toggleAddImages())
})


export default connect(mapStateToProps, mapDispatchToProps) (UploadImageDialog);