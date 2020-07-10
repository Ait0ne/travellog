import React from 'react';
import { motion } from 'framer-motion';


const Landing = () => {
    return (
        <motion.div
        key='landing-page'
        initial={{opacity:0}}
        animate={{opacity:1, transition: {duration: 1, ease: 'easeInOut'}}}
        exit={{opacity:0}}
        >

        </motion.div>
    )
}

export default Landing;