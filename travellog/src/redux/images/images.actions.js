export const setImages = (urls) => ({
    type: 'SET_IMAGES',
    payload: urls
})

export const toggleFullscreenImage = () => ({
    type: 'TOGGLE_FULLSCREEN_IMAGE'
})

export const setFullScreenImage = (imageUrl) => ({
    type: 'SET_FULLSCREEN_IMAGE',
    payload: imageUrl
})