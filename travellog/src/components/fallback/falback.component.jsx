import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './fallback.styles.css';

const Fallback = () => {
    return (
        <div className='fallback-container'>
            <CircularProgress size={50}/>
        </div>
    )
}

export default Fallback;