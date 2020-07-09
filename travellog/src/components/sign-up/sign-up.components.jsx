import React from 'react';
import { Button, InputAdornment, IconButton, TextField } from '@material-ui/core'
import { Visibility, VisibilityOff }  from '@material-ui/icons/'
import { styled } from '@material-ui/core/styles'
import {withRouter} from 'react-router-dom';

import './sign-up.styles.css'
import {auth, createUserProfileDocument} from '../../firebase/firebase.utils'; 



const CustomTextField = styled(TextField)({
    width: '100%',
    marginTop: '15px',
    backgroundColor: '#ffffff'
})

const CustomButton = styled(Button)({
    width: '90%',
    marginTop: '15px',
})


class SignUp extends React.Component {

    constructor() {
        super()


        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword:'',
            passwordVisible: false
        }
    }



    handleSubmit = async event => {
        event.preventDefault();
        const {displayName,email,password,confirmPassword}=this.state

        if (password!==confirmPassword) {
            alert("passwords don't match")
            return;
        }

        try {
            const {user} = await auth.createUserWithEmailAndPassword(email, password)
            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: '',

            })
            await createUserProfileDocument(user, {displayName})
            this.props.history.push(`/${user.uid}`)

        } catch (err) {
            this.props.handleAlert('Аккаунт с таким электронным адресом уже существует', 'error')
        }

    }


    handleChange = event => {
        const {name,value} = event.target;
        this.setState({[name]: value})
    }

    togglePasswordVisibility = () => {
        this.setState({ passwordVisible:!this.state.passwordVisible })
    }



    render() {
        const {displayName,email,password,confirmPassword, passwordVisible}=this.state
        const {translate, deviceWidth} = this.props
        return (
            <div className='sign-up'>
                <div className='form-title'>
                    <h2>Регистрация</h2>
                </div>
                <form onSubmit={this.handleSubmit}>
                <CustomTextField
                    name='displayName'
                    type='text'
                    onChange={this.handleChange}
                    value={displayName}
                    label='Отображаемое Имя'
                    variant='outlined'
                    color='primary'
                    required
                    />
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
                    label='Задайте Пароль'
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
                    <CustomTextField 
                    name='confirmPassword'
                    type={passwordVisible?'text':'password'}
                    onChange={this.handleChange}
                    value={confirmPassword}
                    variant='outlined'
                    label='Повторите Пароль'
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
                        <CustomButton color='primary' variant='contained' size='large' type='submit'>Зарегистрироваться</CustomButton>
                    </div>
                    {deviceWidth<769?
                        <div style={{marginTop:20, marginBottom:10, display:'flex', flexDirection:'column', width:'100%', alignItems: 'center'}}>
                            <span style={{color:'black'}}>Уже зарегистрированы?</span>
                            <span onClick={()=>translate(0)} style={{textDecoration: 'underline', fontWeight:'bold', color:'#303f9f', cursor:'pointer'}}>Войти</span>
                        </div>
                        :null
                }
                
                </form>

            </div>
        )
    }

}

export default withRouter(SignUp);