import React from 'react';
import { motion } from 'framer-motion';
// import {ReactComponent as ContinentsSVG} from '../assets/Continents.svg'
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {styled} from '@material-ui/core/styles';

import './landing.css'

const CustomButton = styled(Button)({
    width: '150px',
    marginTop: '20px'
})


const Landing = () => {
    return (
        <motion.div
        className='landing-page-container'
        key='landing-page'
        initial={{opacity:0}}
        animate={{opacity:1, transition: {duration: 1, ease: 'easeInOut'}}}
        exit={{opacity:0}}
        style={{backgroundImage: `url(${process.env.PUBLIC_URL}landing.jpg)`}}
        >
            <div 
            className='landing-page-first-section-container'
            
            >
                <div className='landing-page-actions'>
                    <h1 className='landing-page-title'>Добро пожаловать в Твой Мир</h1>
                    <h4 className='landing-page-subtitle'>Все самые яркие моменты твоей жизни в одном месте</h4>
                    <Link to='/auth'>
                        <CustomButton color='primary' variant='contained'>Создать</CustomButton>
                    </Link>
                </div>
                
            </div>
            <div 
            className='landing-page-second-section-container'
            >
                <div className='landing-page-cards-container'>
                    <div className='landing-page-card'>
                        <img alt='stack' width={150} src={`${process.env.PUBLIC_URL}photos.png`}/>
                        <p>
                            <span className='text-bold'>Сохрани</span> все яркие моменты своей жизни в уникальном альбоме, который ты никогда не потеряешь
                        </p>
                    </div>
                

                    <div className='landing-page-card'>
                        <img alt='pin' width={150} src={`${process.env.PUBLIC_URL}pin.png`}/>
                        <p>
                            <span className='text-bold'>Поделись</span> впечатлениями, маршрутами, воспоминаниями, мечтами и своим взглядом на мир
                        </p>
                    </div>
                

                    <div className='landing-page-card'>
                        <img alt='airplane' width={150} src={`${process.env.PUBLIC_URL}up.png`}/>
                        <p>
                            <span className='text-bold'>Создай</span> план своего путешествия мечты со всеми местами, которые хочешь посетить и воплоти его в жизнь!
                        </p>
                    </div>
                </div>
                <div className='footer'>
                    <span>Powered by  <img width={150} src={`${process.env.PUBLIC_URL}cesium.png`} alt='cesium-logo'/></span>
                </div>
            </div>

        </motion.div>
    )
}

export default Landing;