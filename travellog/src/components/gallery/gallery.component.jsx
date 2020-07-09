import React, { Fragment} from 'react';
import { connect } from 'react-redux';


import InfiniteScroll from '../infiniteScroll/infiniteScroll.component';
import './gallery.styles.css';




const Gallery = ({ imageUrls }) => {

    return (
        <Fragment>
            <InfiniteScroll images={imageUrls}/>
        </Fragment>
    )
}


const mapStateToProps = state => ({
    imageUrls: state.images.imageUrls,
})



export default connect(mapStateToProps)(Gallery);