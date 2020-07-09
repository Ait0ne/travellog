import React from 'react';

import './avatar.styles.css';


const Avatar = ({imageUrl, width, border, onClick}) => {
    return (
        <div onClick={onClick} className='avatar-image-container' style={{
            backgroundImage:`url(${imageUrl})`,
            width: `${width}px`,
            height: `${width}px`,
            borderRadius: `${width/2}px`,
            border: border? '1.5px solid grey': 'none'
            }}>
        </div>
    )
}


export default Avatar;