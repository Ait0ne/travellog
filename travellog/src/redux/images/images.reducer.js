const INITIAL_STATE = {
    imageUrls:[],
    fullScreenImage: null,
    isFullscreenImageShown: false
}

const imagesReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_IMAGES':
            return {
                ...state, 
                imageUrls: action.payload
            }
        case 'TOGGLE_FULLSCREEN_IMAGE':
            return {
                ...state,
                isFullscreenImageShown: !state.isFullscreenImageShown
            }
        case 'SET_FULLSCREEN_IMAGE':
            return {
                ...state, 
                fullScreenImage: action.payload
            }
        default:
            return state
    }
}

export default imagesReducer;