import React from 'react';
import {connect} from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,

} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';


import { toggleDescriptionEdit} from '../../redux/dialogs/dialogs.actions';
import { editPlace } from '../../firebase/firebase.utils';

const CustomDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column'
})





class EditDescriptionDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           name: '',
           description: '',
           noNameError: false,
        }
    }


    componentDidMount() {
        const {place} = this.props
        this.setState({name: place.name, description: place.description})
    }

    handleSubmit = () => {
        const { name, description, noNameError } = this.state
        const { placeId, userId } = this.props
        if (name==='') {
            this.setState({ noNameError: true })
        }
        if (!noNameError) {
            editPlace(userId, placeId, name, description)
            .then(result => {
                if (result) {
                    this.props.handleEditDescription(name, description)
                    this.handleClose()
                }
            })
        }
    }

    handleChange = (event) => {
        const {name, value} = event.target

        this.setState({[name]: value})
    }

    handleClose = () => {
        this.setState({name: '', description: '', noNameError: false})
        this.props.toggleDescriptionEdit()
    }
    render() {
        const { editDescriptionShown}  =this.props
        const { noNameError, name, description } = this.state
        return (
            <Dialog
            open={editDescriptionShown}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
                <DialogTitle id='form-dialog-title'>
                    Редактирование
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
                </CustomDialogContent>
                <DialogActions>
                    <Button color='secondary' onClick={this.handleClose}>
                        Отменить
                    </Button>
                    <Button color='secondary' onClick={this.handleSubmit}>
                        Редактировать
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({
    editDescriptionShown: state.dialogs.editDescriptionShown
})

const mapDispatchToProps = dispatch => ({
    toggleDescriptionEdit: () => dispatch(toggleDescriptionEdit())
})

export default connect(mapStateToProps, mapDispatchToProps) (EditDescriptionDialog);
