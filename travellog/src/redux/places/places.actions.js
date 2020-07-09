export const setCurrentPlaces = (places_arr) => ({
    type: 'SET_CURRENT_PLACES',
    payload: places_arr
})

export const setLocation = (address) => ({
    type: 'SET_LOCATION',
    payload: address
})

export const toggleEditing = () => ({
    type: 'TOGGLE_EDITING'
})

export const addNewPlace = (place) => ({
    type: 'ADD_NEW_PLACE',
    payload: place
})

export const clearNewPlaces = () => ({
    type: 'CLEAR_NEW_PLACES'
})

export const removeNewPlace = (name) => ({
    type: 'REMOVE_NEW_PLACE',
    payload: name
})

export const setSelectedMarker = (place) => ({
    type: 'SET_SELECTED_MARKER',
    payload: place
})