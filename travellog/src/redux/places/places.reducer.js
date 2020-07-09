import { removeNewPlace } from './places.utils';

const INITIAL_STATE = {
    places: [],
    newPlaces: [],
    isEditing: false,
    location: null,
    selectedMarker: {
        name: '',
        title: '',
        description: ''
    }

}

export const placesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_CURRENT_PLACES':
            return {
                ...state, 
                places: action.payload
            }
        case 'SET_LOCATION':
            return {
                ...state,
                location: action.payload
            }
        case 'ADD_NEW_PLACE': 
            return {
                ...state,
                newPlaces: [...state.newPlaces, action.payload]
            }
        case 'CLEAR_NEW_PLACES':
            return {
                ...state, 
                newPlaces: []
            }
        case 'REMOVE_NEW_PLACE':
            return {
                ...state,
                newPlaces: removeNewPlace(state.newPlaces, action.payload)
            }
        case 'SET_SELECTED_MARKER': 
            return {
                ...state, 
                selectedMarker: action.payload
            }
        case 'TOGGLE_EDITING':
            return {
                ...state,
                isEditing: !state.isEditing
            }
        default:
            return state
    }
}