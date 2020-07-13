import React, {useState, Fragment} from 'react';
import './infiniteScroll.styles.css'
// import {Swipeable} from 'react-swipeable';
import Spinner from '../spinner/spinner.component'
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext'
import {connect} from 'react-redux';
import { Carousel } from 'react-bootstrap'


import {toggleFullscreenImage, setFullScreenImage } from '../../redux/images/images.actions';
import {AWS_URL} from '../../config';



const xMove = 20
const xAlign = 20






const InfiniteScroll =({images, toggleFullscreenImage, setFullScreenImage}) => {
    const currentImages = images.length>5?images.slice(0,5):images
    const [x, setX] = useState(-20)
    const [start, setStart] = useState(0)
    const [end,setEnd] = useState(4)
    const [transition, setTransition] = useState('0.5s')
    const [calledLeft, setCalledLeft] = useState(false)
    const [calledRight, setCalledRight] = useState(false)


    const handleLeft = () => {
            if (!calledLeft) {
            setCalledLeft(true)
            if (start===images.length-1){
                setStart(0)
                } else {
                    setStart(start+1)
                }
                if(end===images.length-1){
                    setEnd(0)
                } else{
                    setEnd(end+1)    
                }
            const slider = document.getElementsByClassName('slider')[0]
            const moveSliderLeft = async() => {
                const firstNode = document.getElementsByClassName('slide')[0]
                const img = firstNode.getElementsByClassName('slide-image')[0]
                img.src=AWS_URL+images[end===images.length-1 ? 0 : end+1].mediumImageUrl
                slider.appendChild(firstNode)
                setTransition('none')
                setX(-xMove)
                setTimeout(() => {
                    setTransition('all 0.5s')  
                    setCalledLeft(false)
                })
                slider.removeEventListener('transitionend', moveSliderLeft)
            }
            slider.addEventListener('transitionend', moveSliderLeft);      
            setX(x-xAlign)
        }
    }

    const handleRight = () => {
            if (!calledRight){
            setCalledRight(true)
            if (start===0){
            setStart(images.length-1)
            } else {
                setStart(start-1)
            }
            if(end===0){
                setEnd(images.length-1)
            } else{
                setEnd(end-1)    
            }     
            const slider = document.getElementsByClassName('slider')[0]
            const moveSliderRight = async() => {
                const lastNode = document.getElementsByClassName('slide')[currentImages.length-1]
                const img = lastNode.getElementsByClassName('slide-image')[0]
                img.src=AWS_URL+images[start===0 ? images.length-1 : start-1].mediumImageUrl
                slider.insertBefore(lastNode,slider.firstChild)
                setTransition('none')
                setX(-xMove)
                setTimeout(() => {
                    setTransition('all 0.5s')  
                    setCalledRight(false)
                })
                slider.removeEventListener('transitionend', moveSliderRight)
            }
            slider.addEventListener('transitionend', moveSliderRight);  
            setX(x+xAlign)
        }
    }

    const handleImageClick = (event) => {
        setFullScreenImage(event.target.src.replace('medium-','').replace(`${AWS_URL}`, ''))
        toggleFullscreenImage()
    }

    return (
        <Fragment>
            {
                images.length>4?
                <Fragment>
                    <div className='carousel-container'>
                        <div className='carousel'>
                            <Spinner style={{display:`${0>x>-65 ? 'none' :  'flex'}`}}/>
                            <div className='slider' style={{display:'flex', flexDirection:'row',transform:`translateX(${x}%)`, transition:transition}}>
                                
                                {currentImages.map((img,index) => 
                                    // <Swipeable  key={index} onSwipedLeft={handleLeft} onSwipedRight={handleRight}{...config} className='slide'>
                                    <div key ={index}  className='slide'>
                                        
                                        <img  onClick={handleImageClick}  className='slide-image'  src={`${AWS_URL}${img.mediumImageUrl}`} style={{width:'100%', userSelect:'none'}}  alt='flower'/>
                                    </div>
                                    //  </Swipeable> 
                                    )
                                    } 
                                
                            </div>
                        </div>
                    </div> 
                    <button className='carousel-buttons left' onClick={handleLeft}><NavigateBefore  fontSize='large' /></button>
                    <button className='carousel-buttons right' onClick={handleRight}><NavigateNext fontSize='large' /></button>
                </Fragment>
                :
                
                <Carousel
                interval={null}
                indicators={false}
                nextIcon={<NavigateNext fontSize='large' />}
                prevIcon={<NavigateBefore  fontSize='large' />}
                >
                    {
                        currentImages.map((img, index)=> {
                            return  <Carousel.Item key ={index}>
                                        <div  className='carousel-item-inner'>
                                            <img   onClick={handleImageClick} className='slide-image'  src={`${AWS_URL}${img.mediumImageUrl}`} style={{width:'100%', userSelect:'none'}}  alt='flower'/>
                                        </div>
                                    </Carousel.Item>
                        })
                    }
                </Carousel>
            }            
        </Fragment>
    )
}


const mapDispatchToProps = dispatch => ({
    toggleFullscreenImage: () => dispatch(toggleFullscreenImage()),
    setFullScreenImage: imageUrl => dispatch(setFullScreenImage(imageUrl))
})

export default connect(null, mapDispatchToProps)(InfiniteScroll);