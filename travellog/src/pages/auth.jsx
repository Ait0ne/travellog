import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { styled } from '@material-ui/core/styles'
import { motion } from 'framer-motion';

import './auth.css'
import SignIn from '../components/sign-in/sign-in.component';
import SignUp from '../components/sign-up/sign-up.components';


const CustomAlert = styled(Alert)({
    position: 'relative',
    bottom: '50px'
})


class Auth extends React.Component {
    constructor() {
        super()
        this.state={
            deviceWidth:0,
            x:0,
            alertShown: false,
            alertText: '',
            alertSeverity: ''
        }
        this.updateDeviceWidth=this.updateDeviceWidth.bind(this)
        this.changeSignInSignUp=this.changeSignInSignUp.bind(this)
    }

    componentDidMount() {
        this.updateDeviceWidth()
        window.addEventListener('resize', this.updateDeviceWidth)
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDeviceWidth)
    }

    updateDeviceWidth() {
        this.setState({deviceWidth:window.innerWidth})
        if (this.state.deviceWidth>768) {
            this.setState({ x:0 })
        } 
    }

    changeSignInSignUp(amount) {
        this.setState({x:amount})
    }

    toggleAlert = () => {
        this.setState({alertShown: !this.state.alertShown})
    }

    handleAlert = (text, severity) =>  {
        console.log(text, severity)
        this.setState({alertText: text, alertSeverity: severity}, () => this.toggleAlert())
        
    }
    
    render() {
        const {x, deviceWidth, alertShown, alertText, alertSeverity} = this.state
        return (
            <motion.div
            className='form-container'
            key='auth-page'
            initial={{opacity:0}}
            animate={{opacity:1, transition: {duration: 0.8, ease: 'easeInOut'}}}
            exit={{opacity:0}}
            >
                {
                    alertShown? <CustomAlert severity={alertSeverity} onClose={this.toggleAlert}>{alertText}</CustomAlert>: null
                }
                <div className='sign-in-sign-up-form'>
                    <div className='auth-small-device-container' style={{transform: `translateX(${x}%)`}}>
                        <SignIn handleAlert={this.handleAlert} translate={this.changeSignInSignUp} deviceWidth={deviceWidth}/>
                        <SignUp handleAlert={this.handleAlert}  translate={this.changeSignInSignUp} deviceWidth={deviceWidth}/>
                    </div>
                </div>
            </motion.div>
        )}
}




export default Auth;