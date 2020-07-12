import React, {useState, useRef} from 'react';
import { connect } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, TextField, Button, Dialog, DialogTitle, DialogContent, IconButton, InputAdornment, useMediaQuery} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Alert from '@material-ui/lab/Alert';
import {styled} from '@material-ui/core/styles';
import axios from 'axios';

import {API_URL, AWS_URL} from '../config';
import {firestore, auth, googleProvider, facebookProvider, emailProvider} from '../firebase/firebase.utils';
import Avatar from '../components/avatar/avatar.component';
import './profile.css';


const CustomTextField = styled(TextField)({
    width: '90%',
    maxWidth: '400px',
    marginTop: '15px',
    backgroundColor: '#ffffff'
})

const CustomButton = styled(Button)({
    width: '90%',
    marginTop: '15px',
})

const CustomAlert = styled(Alert)({
    position: 'relative',
    bottom: '50px'
})
const CustomDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column'
})





const Profile = ({currentUser}) => {
    const [tabValue, setTabValue] = useState(0)
    const [displayName, setDisplayName] = useState(currentUser.displayName)
    const [email, setEmail] = useState(currentUser.email)
    const [alert, setAlert] = useState({shown:false, severity:'', text:''})
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const providerId = auth.currentUser.providerData[0].providerId
    const matches = useMediaQuery('(max-width:600px)')
    const hiddenInput = useRef()

    const variants = {
        close: matches? { x: '-560px'}: {y: '-500px'},
        open: matches? {x: 0,  }: {y: 0},
    }


    const togglePasswordVisible = () => {
        setPasswordVisible(!passwordVisible)
    } 

    const handleTabChange = (event, value) => {
        setTabValue(value)
    }

    const handleChange = event => {
        const {name, value} = event.target
        if (name==='displayName') {
            setDisplayName(value)
        } else if (name==='email') {
            setEmail(value)
        } else if (name==='password') {
            setPassword(value)
        } else if (name==='passwordConfirmation') {
            setPasswordConfirmation(value)
        } else if (name==='newPassword') {
            setNewPassword(value)
        } else if (name==='confirmPassword') {
            setConfirmPassword(value)
        } 

        
    }

    const handleEdit = () => {
        if (displayName===currentUser.displayName&&email===currentUser.email) {
            return 
        } 
        if (email!==currentUser.email) {
            const user = auth.currentUser;
            user.updateEmail(email)
            .then(() => {
                firestore.collection('users')
                .doc(currentUser.id)
                .update({
                    displayName: displayName,
                    email: email
                })
                .then(() => {
                    setAlert({shown:true, text: 'Данные успешно обновлены!', severity: 'success'})
                })
            })
            .catch(err => {
                console.log(err)
                setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
            })
        } else {
            firestore.collection('users')
            .doc(currentUser.id)
            .update({
                displayName: displayName,
                email: email
            })
            .then(() => {
                setAlert({shown:true, text: 'Данные успешно обновлены!', severity: 'success'})
            })
            .catch(err => {
                console.log(err)
                setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
            })
        }
    }

    const toggleAlert = () => {
        setAlert({...alert, shown: !alert.shown})
    }

    const handleEditFormSubmit = (event) => {
        event.preventDefault()
        const user = auth.currentUser;
        if (email!==currentUser.email){
            if (providerId==='google') {
                user.reauthenticateWithPopup(googleProvider)
                .then(() => handleEdit())
                .catch(err => {
                    console.log(err)
                    setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
                })
            } else if (providerId==='facebook') {
                user.reauthenticateWithPopup(facebookProvider)
                .then(() => handleEdit())
                .catch(err => {
                    console.log(err)
                    setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
                })
            } else if (providerId==='password') {
                setConfirmationDialogOpen(true)
            }
        } else {
            handleEdit()
        }

    }

    const handlePasswordConfirmation = (event) => {
        const credential = emailProvider.credential(currentUser.email, passwordConfirmation)
        auth.currentUser.reauthenticateWithCredential(credential).then(() => {
            setPasswordConfirmation('')
            setConfirmationDialogOpen(false)
            handleEdit()
        }
        )
        .catch(err => {
            setPasswordConfirmation('')
            setConfirmationDialogOpen(false)
            setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
        })
    }

    const handlePasswordFormSubmit = (event) => {
        event.preventDefault();
        if (newPassword!==confirmPassword) {
            setAlert({shown:true, text: 'Пароли должны совпадать', severity: 'error'})
            return
        }
        const credential = emailProvider.credential(currentUser.email,  password)
        auth.currentUser.reauthenticateWithCredential(credential)
        .then(() => {
            auth.currentUser.updatePassword(newPassword)
            .then(() => {
                setAlert({shown:true, text: 'Данные успешно обновлены!', severity: 'success'})
            })
        })
        .catch(err => {
            console.log(err)
            setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
        })
    }

    const handleFileUpload = () => {
        hiddenInput.current.click()
    }

    const handleHiddenInputChange = (event) => {
        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file, file.name )
        data.append('userId', currentUser.id)
        data.append('avatar', true)
        event.target.value=''
        axios.post(`${API_URL}images`, data)
        .then(response => {
            const avatar = response.data.files[0]
            console.log(response.data)
            if (avatar) {
                firestore
                .collection('users')
                .doc(currentUser.id)
                .update({
                    avatar: AWS_URL+avatar
                })
                .then(() => {
                    firestore
                    .collection('avatars')
                    .doc(currentUser.id)
                    .set({
                        avatarUrl:AWS_URL+avatar
                    })
                    .then(()=>{
                        setAlert({shown:true, text: 'Данные успешно обновлены!', severity: 'success'})
                    })
                })
                .catch(err => {
                    console.log(err)
                    setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
                })
            } else {
                setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
            }
        } )
        .catch(err => {
            console.log(err)
            setAlert({shown:true, text: 'При обновлении данных произошла непредвиденная ошибка!', severity: 'error'})
        }

        )
    }

    const TabPanel = ({index}) => {
        switch(index) {
            case 0:
                return (
                    <motion.div
                    initial='close'
                    animate='open'
                    exit='close'
                    variants={variants}
                    key='vertical-tab-1' 
                    id='vertical-tab-1' 
                    className='profile-vertical-tab-item' 
                    // hidden={tabValue===0? false: true}
                    >
                        <Avatar width={150} imageUrl={currentUser.avatar} />
                        <Button color='secondary' onClick={handleFileUpload}>Выбрать Фото</Button>
                        <input type='file' hidden onChange={handleHiddenInputChange} ref={hiddenInput} />
                    </motion.div>
                )
            case 1:
                return (
                    <motion.div 
                    initial='close'
                    animate='open'
                    exit='close'
                    variants={variants}
                    key='vertical-tab-2'
                    id='vertical-tab-2' 
                    className='profile-vertical-tab-item' 
                    // hidden={tabValue===1? false: true}
                    >
                        <form className='profile-edit-form' onSubmit={handleEditFormSubmit}>
                            <CustomTextField 
                            type='text'
                            name='displayName'
                            onChange={handleChange}
                            value={displayName}
                            variant='outlined'
                            label='Отображаемое имя'
                            required
                            />
                            <CustomTextField
                            type='email'
                            value={email}
                            name='email'
                            onChange={handleChange}
                            variant='outlined'
                            label='Email'
                            required
                            />
                            <CustomButton color= 'secondary' type='submit'>Сохранить</CustomButton>
                        </form>
                    </motion.div>
                )
            case 2:
                return (
                    <motion.div 
                    initial='close'
                    animate='open'
                    exit='exit'
                    key='vertical-tab-3'
                    id='vertical-tab-3' 
                    className='profile-vertical-tab-item' 
                    // hidden={tabValue===2? false: true}
                    >
                        <form className='profile-edit-form' onSubmit={handlePasswordFormSubmit}>
                            <CustomTextField 
                            name='password'
                            type={passwordVisible?'text':'password'}
                            onChange={handleChange}
                            value={password}
                            variant='outlined'
                            label='Пароль'
                            color='primary'
                            InputProps={{
                                endAdornment:                    
                                <InputAdornment position='end'>
                                    <IconButton onClick={togglePasswordVisible}>
                                        {passwordVisible? <Visibility/>: <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            required
                            />
                            <CustomTextField 
                            name='newPassword'
                            type={passwordVisible?'text':'password'}
                            onChange={handleChange}
                            value={newPassword}
                            variant='outlined'
                            label='Новый Пароль'
                            color='primary'
                            InputProps={{
                                endAdornment:                    
                                <InputAdornment position='end'>
                                    <IconButton onClick={togglePasswordVisible}>
                                        {passwordVisible? <Visibility/>: <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            required
                            />
                            <CustomTextField 
                            name='confirmPassword'
                            type={passwordVisible?'text':'password'}
                            onChange={handleChange}
                            value={confirmPassword}
                            variant='outlined'
                            label='Подтвердите пароль'
                            color='primary'
                            InputProps={{
                                endAdornment:                    
                                <InputAdornment position='end'>
                                    <IconButton onClick={togglePasswordVisible}>
                                        {passwordVisible? <Visibility/>: <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            required
                            />
                            <CustomButton type='submit' color='secondary'>Сменить пароль</CustomButton>
                        </form>
                    </motion.div>
                )
            default:
                return null
        }
    }

    return (
        <motion.div
        className='profile-container'
        key='profile-page'
        initial={{opacity:0}}
        animate={{opacity:1, transition: {duration: 0.8, ease: 'easeInOut'}}}
        exit={{opacity:0}}
        >   
            {
                alert.shown? <CustomAlert  severity={alert.severity} onClose={toggleAlert}>{alert.text}</CustomAlert>: null
            }
            <div className='profile-container-inner'>
                <Tabs
                value={tabValue}
                orientation={matches?'horizontal': 'vertical'}
                onChange={handleTabChange}
                variant='fullWidth'
                >
                    <Tab label='Сменить фото' />
                    <Tab label='Изменить данные'  />
                    {
                        providerId==='password'?
                        <Tab label='Изменить пароль' />
                        :null
                    }
                </Tabs>
                <div className='profile-vertical-tab-container'>
                <AnimatePresence exitBeforeEnter>
                    <TabPanel index={tabValue} key={`tab-panel-${tabValue}`} />
                </AnimatePresence>
                </div>
                {/* {
                    providerId==='password'?
                    <motion.div 
                    animate={tabValue===2? 'open': 'close'}
                    variants={variants}
                    key='vertical-tab-3'
                    id='vertical-tab-3' 
                    className='profile-vertical-tab-item' 
                    hidden={tabValue===2? false: true}
                    >
                        <form className='profile-edit-form' onSubmit={handlePasswordFormSubmit}>
                            <CustomTextField 
                            name='password'
                            type={passwordVisible?'text':'password'}
                            onChange={handleChange}
                            value={password}
                            variant='outlined'
                            label='Пароль'
                            color='primary'
                            InputProps={{
                                endAdornment:                    
                                <InputAdornment position='end'>
                                    <IconButton onClick={togglePasswordVisible}>
                                        {passwordVisible? <Visibility/>: <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            required
                            />
                            <CustomTextField 
                            name='newPassword'
                            type={passwordVisible?'text':'password'}
                            onChange={handleChange}
                            value={newPassword}
                            variant='outlined'
                            label='Новый Пароль'
                            color='primary'
                            InputProps={{
                                endAdornment:                    
                                <InputAdornment position='end'>
                                    <IconButton onClick={togglePasswordVisible}>
                                        {passwordVisible? <Visibility/>: <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            required
                            />
                            <CustomTextField 
                            name='confirmPassword'
                            type={passwordVisible?'text':'password'}
                            onChange={handleChange}
                            value={confirmPassword}
                            variant='outlined'
                            label='Подтвердите пароль'
                            color='primary'
                            InputProps={{
                                endAdornment:                    
                                <InputAdornment position='end'>
                                    <IconButton onClick={togglePasswordVisible}>
                                        {passwordVisible? <Visibility/>: <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            required
                            />
                            <CustomButton type='submit' color='secondary'>Сменить пароль</CustomButton>
                        </form>
                    </motion.div>

                    :null
                } */}

            </div>
            <Dialog
            open={confirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
            aria-labelledby='password-confirmation-dialog-title'
            >
                <DialogTitle id='password-confirmation-dialog-title'>
                    Введите пароль от вашего аккаунта
                </DialogTitle>
                <CustomDialogContent>
                    <CustomTextField
                    type='password'
                    name='passwordConfirmation'
                    value={passwordConfirmation}
                    onChange={handleChange}
                    />
                    <CustomButton color='secondary' onClick={handlePasswordConfirmation}>Подтвердить</CustomButton>
                </CustomDialogContent>
            </Dialog>
        </motion.div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})


export default connect(mapStateToProps)(Profile);