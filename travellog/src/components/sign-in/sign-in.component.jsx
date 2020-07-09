import React from 'react';
import { Button, InputAdornment, IconButton, TextField } from '@material-ui/core'
import { Visibility, VisibilityOff }  from '@material-ui/icons/'
import { styled } from '@material-ui/core/styles'
import {withRouter} from 'react-router-dom';

import './sign-in.styles.css'

import { auth, signInWithFacebook, signInwithGoogle} from '../../firebase/firebase.utils';


const CustomTextField = styled(TextField)({
    width: '100%',
    marginTop: '15px',
    backgroundColor: '#ffffff'
})

const CustomButton = styled(Button)({
    width: '90%',
    marginTop: '15px',
})


class  SignIn extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            email:'',
            password: '',
            passwordVisible: false
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
            if (err.code!=="auth/popup-closed-by-user") {
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
            if (err.code!=="auth/popup-closed-by-user") {
                this.props.handleAlert('Аккаунт ассоциирован с другим методом аутентификации', 'error')
            }
        })
    }

    render() {
        const {translate, deviceWidth} = this.props
        const { email, password, passwordVisible } = this.state
        return (
            <div className='sign-in'>
                <div className='form-title'>
                    <h2>Вход</h2>
                </div>
                <form onSubmit={this.handleSubmit}>
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
                        <CustomButton color='primary' size='large' variant='contained' type='submit'>
                            Войти
                        </CustomButton>
                    </div>
                    <div className='buttons-left'>

                        <img className='google' src='/google.png' alt='google-icon' onClick={this.handleSignInWithGoogle}/>
                        <img className='facebook' src='/facebook.png' alt='facebook-icon' onClick={this.handleSignInWithFaceBook}/>
                        {deviceWidth<769?
                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                            <span style={{color:'black'}}>Нет аккаунта?</span>
                            <span onClick={()=>translate(-50)} style={{textDecoration: 'underline', fontWeight:'bold', color:'#303f9f', cursor:'pointer'}}>Регистрация</span>
                        </div>
                        :null
                        }
                    </div>

                </form>
            </div>
        )
    }
}

export default withRouter(SignIn);