const INITIAL_STATE = {
    createAlbumShown: false,
    sideBarShown:false,
    addImagesShown: false,
    editDescriptionShown: false
}

const dialogsReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case 'TOGGLE_CREATE_ALBUM':
            return {
                ...state,
                createAlbumShown: !state.createAlbumShown
            }
        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                sideBarShown: !state.sideBarShown
            }
        case 'TOGGLE_ADD_IMAGES':
            return {
                ...state,
                addImagesShown: !state.addImagesShown
            }
        case 'TOGGLE_DESCRIPTION_EDIT':
            return {
                ...state,
                editDescriptionShown: !state.editDescriptionShown
            }
        default: 
            return state
    }
}

export default dialogsReducer;

