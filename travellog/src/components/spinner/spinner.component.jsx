import React from 'react';
import './spinner.styles.css';

const Spinner = ({style}) => {
    return (
        <div style={{...style, width:'100%', height:'100%'}}>
            <div className='donut'></div>
        </div>
    )   
}


export default Spinner;