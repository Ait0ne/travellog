import React from 'react';
import { Button, InputAdornment, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core'
import { Visibility, VisibilityOff }  from '@material-ui/icons/'
import { styled } from '@material-ui/core/styles'
import {withRouter} from 'react-router-dom';


import './sign-in.styles.css'

import { auth, signInWithFacebook, signInwithGoogle} from '../../firebase/firebase.utils';


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

const CustomDialogContent =styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '400px'

})

const CustomDialog = styled(Dialog)({
    textAlign: 'center',

})


class  SignIn extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            email:'',
            password: '',
            passwordVisible: false,
            resetEmail: '',
            resetPasswordShown: false,

        }
    }

    handleChange = event => {
        const {value,name} =event.target;
        this.setState({[name]:value})
    }

    handleSubmit =  async event => {
        event.preventDefault();
        const {email, password} = this.state;
        try{
            await auth.signInWithEmailAndPassword(email,password)
            .then(result=>{
                console.log(result)
                this.props.history.push(`/map/${result.user.uid}`)
            });
            this.setState({email:'', password:''})
        } catch (err) {   
            this.props.handleAlert('Неверный e-mail или пароль', 'error')
        }
    }
    
    togglePasswordVisibility = () => {
        this.setState({ passwordVisible:!this.state.passwordVisible })
    }

    handleSignInWithGoogle = () => {
        signInwithGoogle()
        .then(result => {
            if (result.user.uid) {
                this.props.history.push(`/map/${result.user.uid}`)
            }
        })
        .catch(err => {
            console.log(err)
            if (err.code!=="auth/popup-closed-by-user"&&err.code!=="auth/cancelled-popup-request") {
                this.props.handleAlert('Аккаунт ассоциирован с другим методом аутентификации', 'error')
            }
        })
    }

    handleSignInWithFaceBook = () => {
        signInWithFacebook()
        .then(result => {
            if (result.user.uid) {
                this.props.history.push(`/map/${result.user.uid}`)
            }
        })
        .catch(err => {
            console.log(err)
            if (err.code!=="auth/popup-closed-by-user"&&err.code!=="auth/cancelled-popup-request") {
                this.props.handleAlert('Аккаунт ассоциирован с другим методом аутентификации', 'error')
            }
        })
    }

    toggleResetPassword = () => {
        this.setState({resetPasswordShown: !this.state.resetPasswordShown})
    }

    handleResetPassword = (event) => {
        event.preventDefault();
        auth.sendPasswordResetEmail(this.state.resetEmail)
        .then(() => {
            this.toggleResetPassword()
            this.setState({resetEmail: ''})
            this.props.handleAlert('На вашу почту отправлено письмо с указаниями по восстановлению пароля', 'success')
        })
        .catch(err => {
            this.toggleResetPassword()
            this.setState({resetEmail: ''})
            this.props.handleAlert('При отправке письма произошла ошибка', 'error')
        })
    }

    render() {
        const {translate, deviceWidth} = this.props
        const { email, password, passwordVisible, resetPasswordShown, resetEmail } = this.state
        return (
            <div className='sign-in'>
                <form onSubmit={this.handleSubmit}>
                    <div className='form-title'>
                        <h2>Вход</h2>
                    </div>
                    <CustomTextField
                    name='email'
                    type='email'
                    onChange={this.handleChange}
                    value={email}
                    label='Email'
                    variant='outlined'
                    color='primary'
                    required
                    />
                    <CustomTextField 
                    name='password'
                    type={passwordVisible?'text':'password'}
                    onChange={this.handleChange}
                    value={password}
                    variant='outlined'
                    label='Пароль'
                    color='primary'
                    InputProps={{
                        endAdornment:                    
                        <InputAdornment position='end'>
                            <IconButton onClick={this.togglePasswordVisibility}>
                                {passwordVisible? <Visibility/>: <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>,
                    }}
                    required
                    />
                    <div className='buttons'>
                        <CustomButton color='secondary' size='large' variant='contained' type='submit'>
                            Войти
                        </CustomButton>
                    </div>
                    <span onClick={this.toggleResetPassword} className='password-reset-button'>Забыли пароль?</span>
                    <div className='buttons-left'>

                        <img className='google' src='/google.png' alt='google-icon' onClick={this.handleSignInWithGoogle}/>
                        <img className='facebook' src='/facebook.png' alt='facebook-icon' onClick={this.handleSignInWithFaceBook}/>
                    </div>

                </form>
                <CustomDialog 
                aria-labelledby='resetPasswordTitle'
                open={resetPasswordShown}
                onClose={this.toggleResetPassword}
                >
                    <DialogTitle id='resetPasswordTitle'>
                        Восстановление пароля
                    </DialogTitle>
                    <CustomDialogContent>
                        <DialogContentText>
                            Введите адрес электронной почты и мы вышлем Вам инструкции для восстановления пароля
                        </DialogContentText>
                        <form onSubmit={this.handleResetPassword}>
                        <CustomTextField
                        name='resetEmail'
                        type='email'
                        onChange={this.handleChange}
                        value={resetEmail}
                        label='Email'
                        variant='outlined'
                        color='primary'
                        required
                        />
                        <CustomButton type='submit' color='secondary'>
                            Отправить
                        </CustomButton>
                        </form>
                    </CustomDialogContent>
                </CustomDialog>
                {deviceWidth<769?
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <span style={{color:'black'}}>Нет аккаунта?</span>
                    <span onClick={()=>translate(-50)} style={{textDecoration: 'underline', fontWeight:'bold', color:'#303f9f', cursor:'pointer'}}>Регистрация</span>
                </div>
                :null
                }
            </div>
        )
    }
}

export default withRouter(SignIn);