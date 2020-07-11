import React, {Fragment, createRef} from 'react';
import { Viewer, Scene, Camera, Entity, BillboardGraphics, CustomDataSource, CameraFlyTo, Globe} from 'resium';
import { Math, Color, MapboxStyleImageryProvider,  Cartesian3, Cartesian2, EntityCluster, PinBuilder} from 'cesium';
import Popup from '../popup/popup.components';
import { connect } from 'react-redux';
import { Popover, Menu, MenuItem} from '@material-ui/core'
import { withRouter} from 'react-router-dom';

import { setCurrentPlaces, setLocation, addNewPlace, removeNewPlace, setSelectedMarker } from '../../redux/places/places.actions';
import { firestore, removePlace } from '../../firebase/firebase.utils';



const my_token = 'pk.eyJ1IjoiYWl0MG5lIiwiYSI6ImNrYzRtdjN2dTA5OXkzMG52YWtxa2puMTgifQ.YCNUcdUtUY1v10-i6oSpEw'

const mapbox = new MapboxStyleImageryProvider({
    styleId: 'light-v10',
    accessToken: my_token,
    defaultHue: 1
})

// const providerViewModels = []

// providerViewModels.push(new ProviderViewModel({
//     name: 'basic',
//     iconUrl: `${process.env.PUBLIC_URL}/globe.png`,
//     tooltip: 'basic',
//     creationFunction: () => {
//         return new UrlTemplateImageryProvider({
//             url: 'https://api.mapbox.com/styles/v1/ait0ne/ckcg6rq3g0tol1il5iezsnjyp/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWl0MG5lIiwiYSI6ImNrYzRtdjN2dTA5OXkzMG52YWtxa2puMTgifQ.YCNUcdUtUY1v10-i6oSpEw',
//         })
//     }
// }))



const entityCluster = new EntityCluster({
    enabled: true,
    pixelRange: 50,
    minimumClusterSize: 2,
    clusterBillboards:true,
    clusterLabels: false,
    clusterPoints: false,
    
  });

const pinBuilder = new PinBuilder();

entityCluster.clusterEvent.addEventListener((clusteredEntities, cluster) => {
    const redPin = pinBuilder.fromText(`${clusteredEntities.length}`, Color.RED, 48).toDataURL();
    cluster.label.show = false;
    cluster.billboard.show = true;
    cluster.billboard.id = cluster.label.id;
    cluster.billboard.image = redPin
})


class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            leftClickMenuShown: false,
            leftClickMenuPosition: { top: 0, left: 0 },
            rightClickMenuShown: false,
            rightClickMenuPosition: { top: 0, left: 0},
            isLoading: true
        }
    }

    cesium = createRef()
    scene = createRef()
    unsubscribeFromClustering = null;
    clickTimer = null;

    componentDidMount() {
        console.log(this.props)
        const {setCurrentPlaces} = this.props
        console.log(this.cesium.current.cesiumElement)
        this.cesium.current.cesiumElement.camera.flyTo({destination:new Cartesian3.fromDegrees(37.618423,55.751244, 12000000)})
        this.unsubscribeFromPlaces = firestore
        .collection('users')
        .doc(this.props.match.params.userId)
        .collection('places')
        .onSnapshot((snapshot)=> {
            const places = []
            console.log(snapshot)
            snapshot.docs.forEach((doc)=> {
                const {name, longitude, latitude, height, description} = doc.data()
                const id = doc.id
                places.push({
                    id,
                    name,
                    longitude,
                    latitude,
                    height,
                    description
                })
            })
            setCurrentPlaces(places)     
        })
    }

    

    componentWillUnmount() {
        this.unsubscribeFromPlaces()
    }

    handleAddMarker = (x, y) => {
        const { addNewPlace } = this.props
        const scene = this.cesium.current.cesiumElement.scene
        if (!scene) return
        const ellipsoid = scene.globe.ellipsoid;
        const cartesian = scene.camera.pickEllipsoid(new Cartesian2(x, y), ellipsoid);
        if (!cartesian) return
        let {latitude, longitude, height} = ellipsoid.cartesianToCartographic(cartesian);
        latitude = Math.toDegrees(latitude)
        longitude = Math.toDegrees(longitude)
        const id= new Date()
        addNewPlace({longitude, latitude, height, id, name: 'Без Имени' })
    }

    handleRemoveMarker = event => {
        const { removeNewPlace, isEditing, selectedMarker, currentUser } = this.props
        if (isEditing) {
            removeNewPlace(selectedMarker.name)
            setSelectedMarker({ name: '', title: ''})
            this.setState({rightClickMenuShown:false})
        } else {
            removePlace(selectedMarker.name, currentUser.id)
            .then((result) => {
                if (result) {
                    setSelectedMarker({ name: '', title: ''})
                    this.setState({rightClickMenuShown:false})
                }
            })
        }
        
    }

    handleMarkerClick = (obj, entity) => {
        const { isEditing, setSelectedMarker } = this.props
        const name = entity._name
        const {title, description} = entity
        
        
        if (!isEditing) {
            setSelectedMarker({ name: name, title: title, description: description})
            this.setState({ leftClickMenuPosition: { top: obj.position.y, left: obj.position.x }}, () => {
                this.setState({ leftClickMenuShown: true })
            })
        }       
    }

    handleClick = (object) => {
        const {isEditing} = this.props
        if (isEditing) {
            const {x, y} = object.position
            this.handleAddMarker(x, y)
        }
    }

    handleFlyToComplete = () => {
        const {setLocation} = this.props
        setLocation(null)
    }

    handleMarkerRightClick = (obj, entity) => {
        const {setSelectedMarker} = this.props
        setSelectedMarker({name: entity._name, title: entity.title })
        this.setState({ rightClickMenuPosition: { top: obj.position.y, left: obj.position.x  } }, () => {
            this.setState({ rightClickMenuShown: true })
        })
    }

    handleRightClickMenuClose = event => {
        this.setState({rightClickMenuShown: false})
    }

    handleLeftClickMenuClose = event => {
        this.setState({leftClickMenuShown: false})
    }

    onContextMenu = event => {
        event.preventDefault();
    }


    onMouseDown = (obj, entity) => {
        const { currentUser, match } = this.props
        this.clickTimer = setTimeout(() => {
            return currentUser&&match.params.userId===currentUser.id? this.handleMarkerRightClick(obj, entity): null
        }, 1500)
    }

    onMouseUp = (obj, entity) => {
        clearTimeout(this.clickTimer)
        if (!this.state.rightClickMenuShown) {
            this.handleMarkerClick(obj, entity)
        }
    }

    render() {
        const {  rightClickMenuPosition, rightClickMenuShown, leftClickMenuShown, leftClickMenuPosition } = this.state
        const { places_arr, location, newPlaces, isEditing, currentUser} = this.props
        return (
            <Fragment>
                <Viewer 
                    imageryProvider={ mapbox}
                    baseLayerPicker={false} 
                    skyBox={false} 
                    navigationHelpButton={false}
                    timeline={false}
                    animation={false}
                    fullscreenButton={false}
                    skyAtmosphere={false}
                    ref={this.cesium}
                    onClick={this.handleClick}
                    infoBox={false}
                    full
                    geocoder={false}
                    selectionIndicator={false}
                    // imageryProviderViewModels={providerViewModels}
                    >

                    <Scene 
                    backgroundColor={Color.WHITE}  
                    ref = {this.scene}
                    onPostRender={this.handlePostSceneRender}
                    />   
                    <Globe 
                    baseColor={Color.WHITESMOKE} 
                    fillHighlightColor={Color.BLACK}
                    atmosphereBrightnessShift={0.1}
                    />
                    <Camera />
                    {
                        location? <CameraFlyTo destination={new Cartesian3.fromDegrees(location.longitude, location.latitude, 20000)} onComplete={this.handleFlyToComplete}/> : null
                    }

                    {   places_arr.length>0 && !isEditing?
                        <CustomDataSource           
                        clustering={entityCluster}
                        onLoading={this.handleClustering}
                        >
                            {
                            places_arr.map(place => {
                                const {id, name,  longitude, latitude, height, description} = place
                                return(
                                    <Entity 
                                    key={id}
                                    name =  {id}
                                    title = {name}
                                    description = {description}
                                    position={new Cartesian3.fromDegrees(longitude, latitude, height)} 
                                    // onClick={this.handleMarkerClick}
                                    onRightClick={currentUser&&this.props.match.params.userId===currentUser.id? this.handleMarkerRightClick: null}
                                    onMouseDown={this.onMouseDown}
                                    onMouseUp={this.onMouseUp}
                                    >
                                        <BillboardGraphics image={`${process.env.PUBLIC_URL}/marker.png`} />
                                    </Entity>
                                )
                            })
                            }

                        </CustomDataSource>
                        :null
                    }

                    {
                        newPlaces.length>0 && isEditing ?
                        newPlaces.map(place => {
                            const {id,  longitude, latitude, height} = place
                            return(
                                <Entity 
                                key={id}
                                name =  {id}
                                position={new Cartesian3.fromDegrees(longitude, latitude, height)} 
                                onRightClick={this.handleMarkerRightClick}
                                onMouseDown={this.onMouseDown}
                                onMouseUp={this.onMouseUp}
                                
                                >
                                    <BillboardGraphics image={`${process.env.PUBLIC_URL}/marker.png`} />
                                </Entity>
                            )
                        })
                        :null
                    }    
                </Viewer>

                <Popover 
                anchorReference='anchorPosition'
                anchorPosition={{top: leftClickMenuPosition.top, left: leftClickMenuPosition.left}}
                open={leftClickMenuShown}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={this.handleLeftClickMenuClose}
                >
                    <Popup close={this.handleLeftClickMenuClose}/>
                </Popover>

                <Menu
                anchorReference='anchorPosition'
                anchorPosition={{top: rightClickMenuPosition.top, left: rightClickMenuPosition.left}}
                open={rightClickMenuShown}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={this.handleRightClickMenuClose}
                onContextMenu={this.onContextMenu}
                >
                    <MenuItem onClick={this.handleRemoveMarker}>
                        Удалить
                    </MenuItem>
                </Menu>

            </Fragment>            
        )};
}


const mapStateToProps = (state) => ({
    places_arr: state.places.places, 
    location: state.places.location,
    isEditing: state.places.isEditing,
    newPlaces: state.places.newPlaces,
    selectedMarker: state.places.selectedMarker,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
    setCurrentPlaces: places_arr => dispatch(setCurrentPlaces(places_arr)),
    setLocation: address => dispatch(setLocation(address)),
    addNewPlace: place => dispatch(addNewPlace(place)),
    removeNewPlace: name => dispatch(removeNewPlace(name)),
    setSelectedMarker: place => dispatch(setSelectedMarker(place))
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Map));