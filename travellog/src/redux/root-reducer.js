import {combineReducers} from 'redux';
import {placesReducer}  from './places/places.reducer';
import dialogsReducer from './dialogs/dialogs.reducer';
import imagesReducer from './images/images.reducer';
import usersReducer from './users/users.reducer';

const rootReducer = combineReducers({
    places: placesReducer,
    dialogs: dialogsReducer,
    images: imagesReducer,
    user: usersReducer
});

export default rootReducer;